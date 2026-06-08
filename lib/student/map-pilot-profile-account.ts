import { formatCpf } from "@/lib/cadastro-mocks";
import { resolveClientAvatarUrl } from "@/lib/client-avatar";

import type { PilotAccountApiDTO } from "@/lib/contracts/api/v1/pilot.api.schemas";

import type { PilotProfileApiDTO } from "@/lib/contracts/api/v1/pilot.api.schemas";

import type {

  ProfileLegalDocuments,

  StudentAccountBundle,

  StudentUserProfile,

} from "@/lib/contracts/student/profile";



function splitName(fullName: string): { firstName: string; lastName: string } {

  const parts = fullName.trim().split(/\s+/);

  const firstName = parts[0] ?? fullName;

  const lastName = parts.slice(1).join(" ");

  return { firstName, lastName };

}



function mapCategorySlug(slug: string | undefined): string {

  if (!slug) return "";

  if (slug === "mirim-cadete") return "cadete";

  return slug;

}



type ProfileDto = PilotProfileApiDTO & {

  privacyAcceptedAt?: string;

  termsAcceptedAt?: string;

  mediaConsentAccepted?: boolean;

  mediaAcceptedAt?: string;

  mediaRevokedAt?: string;

  guardianName?: string;

  guardianEmail?: string | null;

  guardianPhone?: string | null;

  guardianRelationship?: string;

};



function buildPilotProfile(dto: ProfileDto): StudentUserProfile {

  const { firstName, lastName } = splitName(dto.name);

  const mainCategory = mapCategorySlug(dto.categorySlugs[0]);

  const guardianInfo =
    dto.guardianName || dto.isMinor
      ? {
          guardian: {
            fullName: dto.guardianName ?? "Responsável",
            phone: dto.guardianPhone ?? "",
            email: dto.guardianEmail ?? "",
            relationship: dto.guardianRelationship ?? "—",
          },
        }
      : {};



  return {

    id: dto.id,

    role: "piloto",

    avatarUrl: resolveClientAvatarUrl(dto.avatarUrl),

    firstName,

    lastName,

    email: dto.email ?? "",

    phone: dto.phone ?? "",

    birthDate: dto.birthDate ?? "",

    cpf: dto.cpf ? formatCpf(dto.cpf) : "",

    city: dto.city ?? "",

    state: dto.state?.trim() || "DF",

    mainCategory,

    experienceLevel: dto.skillLevelSlug,

    favoriteNumber: dto.favoriteNumber ?? "",

    weightKg: dto.weightKg ?? "",

    heightCm: dto.heightCm ?? "",

    notifyWhatsapp: dto.notifyWhatsapp ?? true,

    notifyEmail: dto.notifyEmail ?? true,

    emergencyName: dto.emergencyName ?? "",

    emergencyPhone: dto.emergencyPhone ?? "",

    emergencyRelation: dto.emergencyRelation ?? "",

    googleConnected: false,

    sessions: [],

    privacyAcceptedAt: dto.privacyAcceptedAt ?? "",

    termsAcceptedAt: dto.termsAcceptedAt ?? "",

    mediaConsentAccepted: dto.mediaConsentAccepted ?? false,

    mediaAcceptedAt: dto.mediaAcceptedAt ?? "",

    mediaRevokedAt: dto.mediaRevokedAt ?? "",

    ...guardianInfo,

  };

}



function mapLegalDocuments(

  docs: PilotAccountApiDTO["legalDocuments"],

): ProfileLegalDocuments | undefined {

  if (!docs) return undefined;

  const mapped: ProfileLegalDocuments = {};

  if (docs.privacy) {

    mapped.privacy = { title: docs.privacy.title, body: docs.privacy.content };

  }

  if (docs.terms) {

    mapped.terms = { title: docs.terms.title, body: docs.terms.content };

  }

  if (docs.media) {

    mapped.media = { title: docs.media.title, body: docs.media.content };

  }

  return Object.keys(mapped).length > 0 ? mapped : undefined;

}



export function mapPilotAccountBundle(

  bundle: PilotAccountApiDTO,

): StudentAccountBundle {

  const profile = buildPilotProfile(bundle.profile);

  profile.sessions = bundle.sessions.map((s) => ({

    id: s.id,

    device: s.device,

    deviceKind: s.deviceKind,

    browser: s.browser,

    lastActive: s.lastActive,

    current: s.current,

  }));



  const profiles: Record<string, StudentUserProfile> = {

    [profile.id]: profile,

  };



  for (const linked of bundle.linkedProfiles ?? []) {
    if (profiles[linked.id]) continue;
    profiles[linked.id] = buildPilotProfile(linked);
  }

  for (const linked of bundle.linkedPilots) {
    if (profiles[linked.profileId]) continue;

    profiles[linked.profileId] = {
      ...buildPilotProfile(bundle.profile),
      id: linked.profileId,
      firstName: linked.fullName.split(" ")[0] ?? linked.fullName,
      lastName: linked.fullName.split(" ").slice(1).join(" "),
      avatarUrl: linked.avatarUrl,
      mainCategory: linked.category.toLowerCase(),
    };
  }



  return {

    kind: "piloto",

    selfId: profile.id,

    profiles,

    linkedPilots: bundle.linkedPilots,

    legalDocuments: mapLegalDocuments(bundle.legalDocuments),

  };

}



export function mapPilotProfileToAccount(

  dto: PilotProfileApiDTO,

): StudentAccountBundle {

  return mapPilotAccountBundle({

    profile: dto,

    linkedPilots: [],

    linkedProfiles: [],

    sessions: [],

    legalDocuments: {},

  });

}



function normalizeOptionalEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return null;
  return trimmed;
}

export function mapProfilePatchToApi(
  profile: StudentUserProfile,
): Partial<
  Pick<
    PilotProfileApiDTO,
    | "name"
    | "email"
    | "phone"
    | "avatarUrl"
    | "weightKg"
    | "heightCm"
    | "city"
    | "state"
    | "notifyWhatsapp"
    | "notifyEmail"
    | "emergencyName"
    | "emergencyPhone"
    | "emergencyRelation"
    | "favoriteNumber"
  >
> {
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim();
  const avatarTrimmed = profile.avatarUrl.trim();

  return {
    ...(name ? { name } : {}),
    email: normalizeOptionalEmail(profile.email),
    phone: profile.phone.trim() || null,
    ...(avatarTrimmed ? { avatarUrl: avatarTrimmed } : { avatarUrl: null }),
    weightKg: profile.weightKg.trim() || null,
    heightCm: profile.heightCm.trim() || null,
    city: profile.city.trim() || null,
    state: profile.state.trim() || null,
    notifyWhatsapp: profile.notifyWhatsapp,
    notifyEmail: profile.notifyEmail,
    emergencyName: profile.emergencyName.trim() || null,
    emergencyPhone: profile.emergencyPhone.trim() || null,
    emergencyRelation: profile.emergencyRelation.trim() || null,
    favoriteNumber: profile.favoriteNumber.trim() || null,
  };
}


