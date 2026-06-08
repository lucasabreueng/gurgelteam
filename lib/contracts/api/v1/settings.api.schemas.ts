import { z } from "zod";

import { MODULE_KEYS } from "../../enums";
import { zTimeHHmm, zUuid } from "../common.schemas";
import { zRoleKey } from "./auth.api.schemas";

export const zModuleKey = z.enum(MODULE_KEYS);

export const modulePermissionSchema = z.object({
  moduleKey: zModuleKey,
  canView: z.boolean(),
  canEdit: z.boolean(),
  canDelete: z.boolean(),
});

export const organizationSettingsSchema = z.object({
  teamName: z.string().min(1),
  logoUrl: z.string().nullable().optional(),
  cnpj: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  tiktok: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),
  institutionalText: z.string().nullable().optional(),
});

export const updateOrganizationSettingsSchema =
  organizationSettingsSchema.partial();

export type OrganizationSettingsApiDTO = z.infer<
  typeof organizationSettingsSchema
>;

export const settingsUserSchema = z.object({
  /** Perfil de permissões (`user-administrador`, etc.) ou UUID de conta real. */
  id: z.string().min(1),
  name: z.string(),
  email: z.string().email().optional(),
  roleKey: zRoleKey.optional(),
  modules: z.array(modulePermissionSchema),
});

export const updateUserPermissionsSchema = z.object({
  modules: z.array(modulePermissionSchema).min(1),
  /** Nome exibido do perfil (função) em Configurações. */
  name: z.string().min(1).optional(),
});

export const replaceSettingsUsersSchema = z.object({
  users: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      modules: z.array(modulePermissionSchema),
    }),
  ),
});

export type SettingsUserApiDTO = z.infer<typeof settingsUserSchema>;
export type UpdateUserPermissionsRequest = z.infer<
  typeof updateUserPermissionsSchema
>;

export const permissionProfileIdParamSchema = z.object({
  profileId: z.string().min(1),
});

export const permissionProfileAssigneeSchema = z.object({
  id: zUuid,
  name: z.string(),
  email: z.string().email(),
});

export const permissionProfileAssigneesResponseSchema = z.object({
  profileId: z.string(),
  assignees: z.array(permissionProfileAssigneeSchema),
});

export type PermissionProfileAssigneeDTO = z.infer<
  typeof permissionProfileAssigneeSchema
>;
export type PermissionProfileAssigneesResponseDTO = z.infer<
  typeof permissionProfileAssigneesResponseSchema
>;

export const weekScheduleSlotSchema = z.object({
  id: zUuid.optional(),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: zTimeHHmm,
  endTime: zTimeHHmm,
  categoryId: zUuid.nullable().optional(),
  levelId: zUuid.nullable().optional(),
  sortOrder: z.number().int().default(0),
});

export const replaceWeekScheduleSlotsSchema = z.object({
  slots: z.array(weekScheduleSlotSchema),
});

export const categoryPriceSchema = z.object({
  categoryId: zUuid,
  pricePerLessonCents: z.number().int().min(0),
});

export const skillLevelSettingsSchema = z.object({
  id: zUuid,
  slug: z.string(),
  name: z.string(),
  thresholds: z.record(z.string(), z.number()),
  sortOrder: z.number().int(),
});

export const kartCategorySettingsSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().nullable().optional(),
  pricePerLessonCents: z.number().int().min(0),
  includedItems: z.string().nullable().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const skillLevelCategoryRequirementSchema = z.object({
  categoryId: z.string().min(1),
  timeHundredths: z.number().int().min(0),
});

export const skillLevelUiSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  categoryRequirements: z.array(skillLevelCategoryRequirementSchema),
});

export const settingsCatalogSchema = z.object({
  categories: z.array(kartCategorySettingsSchema),
  skillLevels: z.array(skillLevelUiSchema),
});

export const replaceSettingsCatalogSchema = settingsCatalogSchema;

export type SettingsCatalogApiDTO = z.infer<typeof settingsCatalogSchema>;

export const notificationChannelSchema = z.enum(["whatsapp", "email", "interna"]);

export const notificationEventSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  channels: z.record(notificationChannelSchema, z.boolean()),
});

export const replaceNotificationEventsSchema = z.object({
  events: z.array(notificationEventSchema),
});

export type NotificationEventApiDTO = z.infer<typeof notificationEventSchema>;

export const documentTemplateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  content: z.string(),
  lastUpdated: z.string(),
  revision: z.number().int().min(1).default(1),
  publishedRevision: z.number().int().min(0).default(0),
  status: z.enum(["publicado", "em_revisao", "rascunho"]),
});

export const replaceDocumentTemplatesSchema = z.object({
  documents: z.array(documentTemplateSchema),
});

export type DocumentTemplateApiDTO = z.infer<typeof documentTemplateSchema>;

const dreAccountTermSchema = z.object({
  id: z.string(),
  label: z.string(),
  kind: z.enum(["group", "line", "subtotal", "total"]),
  parentId: z.string().optional(),
  level: z.number().int(),
  locked: z.boolean().optional(),
});

const financialCategoryTermSchema = z.object({
  id: z.string(),
  name: z.string(),
  flow: z.enum(["revenue", "expense"]),
  group: z.string().optional(),
});

const inventoryPartCategoryTermSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const registeredMotorTermSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const registeredChassisTermSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const termsRegistrySchema = z.object({
  dreAccounts: z.array(dreAccountTermSchema),
  financialCategories: z.array(financialCategoryTermSchema),
  inventoryPartCategories: z.array(inventoryPartCategoryTermSchema),
  motors: z.array(registeredMotorTermSchema),
  chassis: z.array(registeredChassisTermSchema),
});

export type TermsRegistryApiDTO = z.infer<typeof termsRegistrySchema>;

export const integrationItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  status: z.enum(["conectado", "pendente", "desconectado"]),
});

export const replaceIntegrationsSchema = z.object({
  integrations: z.array(integrationItemSchema),
});

export const appearanceSettingsSchema = z.object({
  systemLogo: z.string(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  panelImage: z.string(),
  theme: z.enum(["light", "dark"]),
});

export const replaceAppearanceSettingsSchema = appearanceSettingsSchema;

export const securityCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});

export const securityCardsSchema = z.object({
  cards: z.array(securityCardSchema),
});

export type IntegrationItemApiDTO = z.infer<typeof integrationItemSchema>;
export type AppearanceSettingsApiDTO = z.infer<typeof appearanceSettingsSchema>;
