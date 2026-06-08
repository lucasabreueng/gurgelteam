import type { Prisma } from "@prisma/client";

import {
  APPEARANCE_SETTINGS,
  DOCUMENT_TEMPLATES,
  INTEGRATIONS,
  NOTIFICATION_EVENTS,
  REMOVED_DOCUMENT_TEMPLATE_IDS,
} from "@/lib/admin-settings-mocks";
import { normalizeDocumentTemplate } from "@/lib/legal/document-template-utils";
import { SETTINGS_TERMS_REGISTRY } from "@/lib/admin-settings-terms-mocks";
import type {
  appearanceSettingsSchema,
  documentTemplateSchema,
  integrationItemSchema,
  notificationEventSchema,
  termsRegistrySchema,
} from "@/lib/contracts/api/v1/settings.api.schemas";
import type { z } from "zod";
import { prisma } from "@/lib/server/prisma";

type NotificationEvent = z.infer<typeof notificationEventSchema>;
type DocumentTemplate = z.infer<typeof documentTemplateSchema>;
type TermsRegistry = z.infer<typeof termsRegistrySchema>;
type IntegrationItem = z.infer<typeof integrationItemSchema>;
type AppearanceSettings = z.infer<typeof appearanceSettingsSchema>;

async function ensureOrgRow() {
  return prisma.organizationSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default", teamName: "Gurgel Team" },
  });
}

function parseJsonArray<T>(value: unknown, fallback: T[]): T[] {
  if (!Array.isArray(value)) return fallback;
  return value as T[];
}

function withoutRemovedDocuments(
  documents: DocumentTemplate[],
): DocumentTemplate[] {
  return documents.filter((doc) => !REMOVED_DOCUMENT_TEMPLATE_IDS.has(doc.id));
}

/** Mescla documentos salvos com templates padrão (IDs ausentes no banco). */
function mergeDocumentTemplates(stored: DocumentTemplate[]): DocumentTemplate[] {
  const activeStored = withoutRemovedDocuments(stored);
  if (activeStored.length === 0) {
    return DOCUMENT_TEMPLATES.map((doc) => normalizeDocumentTemplate(doc));
  }
  const byId = new Map(
    activeStored.map((doc) => [doc.id, normalizeDocumentTemplate(doc)]),
  );
  for (const fallback of DOCUMENT_TEMPLATES) {
    if (!byId.has(fallback.id)) {
      byId.set(fallback.id, normalizeDocumentTemplate(fallback));
    }
  }
  return Array.from(byId.values()).map((doc) => normalizeDocumentTemplate(doc));
}

function parseJsonObject<T extends Record<string, unknown>>(
  value: unknown,
  fallback: T,
): T {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as T;
  }
  return fallback;
}

function parseTermsRegistry(value: unknown): TermsRegistry {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const o = value as Record<string, unknown>;
    if (Array.isArray(o.dreAccounts)) {
      return value as TermsRegistry;
    }
  }
  return { ...SETTINGS_TERMS_REGISTRY };
}

export const settingsContentRepository = {
  async getNotificationEvents(): Promise<NotificationEvent[]> {
    const row = await ensureOrgRow();
    return parseJsonArray(row.notificationEvents, NOTIFICATION_EVENTS);
  },

  async replaceNotificationEvents(
    events: NotificationEvent[],
  ): Promise<NotificationEvent[]> {
    const row = await ensureOrgRow();
    await prisma.organizationSettings.update({
      where: { id: row.id },
      data: {
        notificationEvents: events as unknown as Prisma.InputJsonValue,
      },
    });
    return events;
  },

  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    const row = await ensureOrgRow();
    const stored = parseJsonArray(row.documentTemplates, []);
    return mergeDocumentTemplates(stored);
  },

  async replaceDocumentTemplates(
    documents: DocumentTemplate[],
  ): Promise<DocumentTemplate[]> {
    const row = await ensureOrgRow();
    const normalized = withoutRemovedDocuments(documents).map((doc) =>
      normalizeDocumentTemplate(doc),
    );
    await prisma.organizationSettings.update({
      where: { id: row.id },
      data: {
        documentTemplates: normalized as unknown as Prisma.InputJsonValue,
      },
    });
    return normalized;
  },

  async getTermsRegistry(): Promise<TermsRegistry> {
    const row = await ensureOrgRow();
    return parseTermsRegistry(row.termsRegistry);
  },

  async replaceTermsRegistry(
    registry: TermsRegistry,
  ): Promise<TermsRegistry> {
    const row = await ensureOrgRow();
    await prisma.organizationSettings.update({
      where: { id: row.id },
      data: {
        termsRegistry: registry as unknown as Prisma.InputJsonValue,
      },
    });
    return registry;
  },

  async getIntegrations(): Promise<IntegrationItem[]> {
    const row = await ensureOrgRow();
    return parseJsonArray(row.integrations, INTEGRATIONS);
  },

  async replaceIntegrations(
    integrations: IntegrationItem[],
  ): Promise<IntegrationItem[]> {
    const row = await ensureOrgRow();
    await prisma.organizationSettings.update({
      where: { id: row.id },
      data: {
        integrations: integrations as unknown as Prisma.InputJsonValue,
      },
    });
    return integrations;
  },

  async getAppearance(): Promise<AppearanceSettings> {
    const row = await ensureOrgRow();
    return parseJsonObject(row.appearance, APPEARANCE_SETTINGS);
  },

  async replaceAppearance(
    appearance: AppearanceSettings,
  ): Promise<AppearanceSettings> {
    const row = await ensureOrgRow();
    await prisma.organizationSettings.update({
      where: { id: row.id },
      data: {
        appearance: appearance as unknown as Prisma.InputJsonValue,
      },
    });
    return appearance;
  },
};
