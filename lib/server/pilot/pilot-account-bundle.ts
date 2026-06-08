import { ConsentType, type User } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import type {
  PilotAccountApiDTO,
  PilotProfileApiDTO,
} from "@/lib/contracts/api/v1/pilot.api.schemas";
import { getAutoPilotCategory, getCategoryLabel } from "@/lib/student-profile-mocks";
import { resolveClientAvatarUrl } from "@/lib/client-avatar";
import { getRelationshipLabel } from "@/lib/register-pilot-mocks";
import { loadPublishedRegistrationLegalDocuments } from "@/lib/server/auth/registration-legal-documents";
import { clientInclude } from "@/lib/server/clients/map-client";
import { prisma } from "@/lib/server/prisma";
import { hashSessionToken } from "@/lib/server/auth/session-token";
import { formatLapMs } from "@/lib/server/format-lap";
import { mapClientToPilotProfile } from "@/lib/server/pilot/pilot-repository";
import { parseSessionUserAgent } from "@/lib/server/pilot/parse-session-user-agent";

function formatConsentDateTime(date: Date | null | undefined): string {
  if (!date) return "";
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

function formatSessionLastActive(date: Date): string {
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return `Hoje, ${format(date, "HH:mm", { locale: ptBR })}`;
  }

  return format(date, "EEE., dd/MM '·' HH:mm", { locale: ptBR });
}

function categorySlugForAge(value: string): string {
  if (value === "mirim" || value === "cadete") return "mirim-cadete";
  return value;
}

export async function ensureGuardianForUser(
  user: User,
  phone?: string | null,
): Promise<string> {
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const existing = await prisma.guardian.findFirst({
    where: { email: user.email },
  });
  if (existing) {
    if (phone && !existing.phone) {
      await prisma.guardian.update({
        where: { id: existing.id },
        data: { phone },
      });
    }
    return existing.id;
  }

  const created = await prisma.guardian.create({
    data: {
      name: fullName,
      email: user.email,
      phone: phone ?? null,
      cpf: user.cpf ?? null,
    },
  });
  return created.id;
}

async function getNextTrainingLabel(clientId: string): Promise<string> {
  const event = await prisma.scheduleEvent.findFirst({
    where: {
      clientId,
      startsAt: { gte: new Date() },
      status: { notIn: ["cancelado"] },
    },
    orderBy: { startsAt: "asc" },
  });
  if (!event) return "Sem treino agendado";
  const dateLabel = format(event.startsAt, "EEE., dd MMM '·' HH:mm", {
    locale: ptBR,
  });
  return dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1);
}

type GuardianContext = {
  fullName: string;
  email: string;
  phone: string;
  relationship: string;
  userId: string | null;
};

async function resolveGuardianForMinorClient(
  clientId: string,
): Promise<GuardianContext | null> {
  const link = await prisma.guardianLink.findFirst({
    where: { clientId },
    include: { guardian: true },
    orderBy: { createdAt: "desc" },
  });
  if (!link) return null;

  const guardianUser = link.guardian.email
    ? await prisma.user.findFirst({
        where: { email: link.guardian.email },
        include: { client: { select: { phone: true } } },
      })
    : null;

  const phone =
    link.guardian.phone?.trim() ||
    guardianUser?.client?.phone?.trim() ||
    "";

  return {
    fullName: link.guardian.name,
    email: link.guardian.email ?? "",
    phone,
    relationship: link.relationship
      ? getRelationshipLabel(link.relationship)
      : "—",
    userId: guardianUser?.id ?? null,
  };
}

async function loadMediaConsentForUser(userId: string) {
  const allConsents = await prisma.consent.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  const latestImage = allConsents.find((c) => c.type === ConsentType.image);
  const imageAccepted =
    latestImage?.status === "ACCEPTED" && Boolean(latestImage.acceptedAt);
  const imageRevoked =
    latestImage?.status === "REVOKED" && Boolean(latestImage.revokedAt);

  return {
    mediaConsentAccepted: imageAccepted,
    mediaAcceptedAt: imageAccepted
      ? formatConsentDateTime(latestImage?.acceptedAt)
      : "",
    mediaRevokedAt: imageRevoked
      ? formatConsentDateTime(latestImage?.revokedAt)
      : "",
  };
}

export async function buildPilotAccountBundle(
  user: User,
  currentSessionToken?: string | null,
): Promise<PilotAccountApiDTO> {
  if (!user.clientId) {
    throw new Error("Usuário sem perfil de cliente vinculado.");
  }

  const client = await prisma.client.findUnique({
    where: { id: user.clientId },
    include: { ...clientInclude, user: true },
  });
  if (!client) {
    throw new Error("Perfil de piloto não encontrado.");
  }

  const profile = mapClientToPilotProfile(client);
  const isMinorAccount = client.isMinor;

  let linkedProfiles: PilotProfileApiDTO[] = [];
  let linkedPilots: PilotAccountApiDTO["linkedPilots"] = [];
  let guardianContext: GuardianContext | null = null;

  if (isMinorAccount) {
    guardianContext = await resolveGuardianForMinorClient(client.id);
  } else {
    const adultClient = await prisma.client.findUnique({
      where: { id: user.clientId },
      select: { phone: true },
    });
    const guardianId = await ensureGuardianForUser(user, adultClient?.phone ?? null);

    const links = await prisma.guardianLink.findMany({
      where: { guardianId },
      include: {
        client: {
          include: {
            user: true,
            categories: { include: { category: true } },
            skillLevel: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const guardianFullName = `${user.firstName} ${user.lastName}`.trim();

    linkedProfiles = links.map((link) => {
      const minor = link.client;
      const mapped = mapClientToPilotProfile(minor);
      return {
        ...mapped,
        guardianName: guardianFullName,
        guardianEmail: user.email,
        guardianPhone: adultClient?.phone ?? null,
        guardianRelationship: link.relationship
          ? getRelationshipLabel(link.relationship)
          : undefined,
      };
    });

    linkedPilots = await Promise.all(
      links.map(async (link) => {
        const minor = link.client;
        const mapped = mapClientToPilotProfile(minor);
        const slug = mapped.categorySlugs[0];
        const auto = getAutoPilotCategory(mapped.birthDate ?? "");
        const category =
          auto?.label ??
          getCategoryLabel(
            slug === "mirim-cadete" ? "cadete" : (slug ?? ""),
          );

        return {
          profileId: mapped.id,
          fullName: mapped.name,
          avatarUrl: resolveClientAvatarUrl(mapped.avatarUrl),
          category,
          level: minor.skillLevel.name,
          nextTraining: await getNextTrainingLabel(mapped.id),
          bestTime: minor.bestLapMs ? formatLapMs(minor.bestLapMs) : "—",
        };
      }),
    );
  }

  const currentHash = currentSessionToken
    ? hashSessionToken(currentSessionToken)
    : null;

  const dbSessions = await prisma.session.findMany({
    where: {
      userId: user.id,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const sessions = dbSessions.map((session) => {
    const parsed = parseSessionUserAgent(session.userAgent);
    return {
      id: session.id,
      device: parsed.device,
      deviceKind: parsed.deviceKind,
      browser: parsed.browser,
      lastActive: formatSessionLastActive(session.createdAt),
      current: currentHash ? session.tokenHash === currentHash : false,
    };
  });

  const acceptedConsents = await prisma.consent.findMany({
    where: {
      userId: user.id,
      status: "ACCEPTED",
    },
    orderBy: { acceptedAt: "desc" },
  });

  const latestPrivacy = acceptedConsents.find((c) => c.type === ConsentType.privacy);
  const latestTerms = acceptedConsents.find((c) => c.type === ConsentType.terms);

  const mediaConsentUserId =
    isMinorAccount && guardianContext?.userId
      ? guardianContext.userId
      : user.id;
  const mediaConsent = await loadMediaConsentForUser(mediaConsentUserId);

  const legalDocs = await loadPublishedRegistrationLegalDocuments();
  const privacyDoc = legalDocs.find((d) => d.key === "privacy");
  const termsDoc = legalDocs.find((d) => d.key === "terms");
  const imageDoc = legalDocs.find((d) => d.key === "image");

  const privacyAcceptedAt =
    formatConsentDateTime(latestPrivacy?.acceptedAt) ||
    formatConsentDateTime(user.createdAt);
  const termsAcceptedAt =
    formatConsentDateTime(latestTerms?.acceptedAt) ||
    formatConsentDateTime(user.createdAt);

  return {
    profile: {
      ...profile,
      ...(guardianContext
        ? {
            guardianName: guardianContext.fullName,
            guardianEmail: guardianContext.email,
            guardianPhone: guardianContext.phone,
            guardianRelationship: guardianContext.relationship,
          }
        : {}),
      privacyAcceptedAt,
      termsAcceptedAt,
      ...mediaConsent,
    },
    linkedPilots,
    linkedProfiles,
    sessions,
    legalDocuments: {
      privacy: privacyDoc
        ? { title: privacyDoc.title, content: privacyDoc.content }
        : undefined,
      terms: termsDoc
        ? { title: termsDoc.title, content: termsDoc.content }
        : undefined,
      media: imageDoc
        ? { title: imageDoc.title, content: imageDoc.content }
        : undefined,
    },
  };
}

export { categorySlugForAge };
