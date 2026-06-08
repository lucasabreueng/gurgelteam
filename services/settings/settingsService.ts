import { getDataSourceMode } from "@/lib/data-source/mode";
import type { SettingsUserAccount } from "@/lib/contracts/settings";
import { listMockPermissionProfileAssignees } from "@/lib/settings/list-profile-assignees-mock";
import { SettingsRepositoryHttp } from "@/repositories/settings/SettingsRepositoryHttp";
import { SettingsRepositoryMock } from "@/repositories/settings/SettingsRepositoryMock";

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

export function createSettingsService() {
  return {
    getTabs: () => SettingsRepositoryMock.getTabs(),
    getGeneralSettings: () =>
      isHttpMode()
        ? SettingsRepositoryHttp.getOrganization().then((org) => ({
            teamName: org.teamName,
            logo: org.logoUrl ?? "",
            cnpj: org.cnpj ?? "",
            email: org.email ?? "",
            whatsapp: org.whatsapp ?? "",
            address: org.address ?? "",
            instagram: org.instagram ?? "",
            tiktok: org.tiktok ?? "",
            facebook: org.facebook ?? "",
            institutionalText: org.institutionalText ?? "",
          }))
        : Promise.resolve(SettingsRepositoryMock.getGeneralSettings()),
    getPermissionLabels: () => SettingsRepositoryMock.getPermissionLabels(),
    getRoles: () => SettingsRepositoryMock.getRoles(),
    getWeekSchedule: () => SettingsRepositoryMock.getWeekSchedule(),
    getSpecificDateSchedules: () =>
      SettingsRepositoryMock.getSpecificDateSchedules(),
    getScheduleExceptions: () => SettingsRepositoryMock.getScheduleExceptions(),
    getCategoryPrices: () => SettingsRepositoryMock.getCategoryPrices(),
    getSettingsUsers: (): Promise<SettingsUserAccount[]> =>
      isHttpMode()
        ? SettingsRepositoryHttp.listUsers()
        : Promise.resolve(SettingsRepositoryMock.getSettingsUsers()),
    getProfileAssignees: (profileId: string) =>
      isHttpMode()
        ? SettingsRepositoryHttp.listProfileAssignees(profileId)
        : Promise.resolve(listMockPermissionProfileAssignees(profileId)),
    saveSettingsUsers: (users: SettingsUserAccount[]) =>
      isHttpMode()
        ? SettingsRepositoryHttp.saveAllPermissionProfiles(users)
        : Promise.resolve(users),
    getKartCategories: () => SettingsRepositoryMock.getKartCategories(),
    getSkillLevels: () => SettingsRepositoryMock.getSkillLevels(),
    getSettingsCatalog: () =>
      isHttpMode()
        ? SettingsRepositoryHttp.getCatalog()
        : Promise.reject(new Error("Catalog API only in HTTP mode")),
    saveSettingsCatalog: (
      payload: Parameters<typeof SettingsRepositoryHttp.replaceCatalog>[0],
    ) =>
      isHttpMode()
        ? SettingsRepositoryHttp.replaceCatalog(payload)
        : Promise.reject(new Error("Catalog API only in HTTP mode")),
    getWeekDayKeyFromDate: SettingsRepositoryMock.getWeekDayKeyFromDate,
    getEffectiveScheduleSlotsForDate:
      SettingsRepositoryMock.getEffectiveScheduleSlotsForDate,
    scheduleSlotDurationMinutes: SettingsRepositoryMock.scheduleSlotDurationMinutes,
    formatScheduleDuration: SettingsRepositoryMock.formatScheduleDuration,
    findScheduleSlot: SettingsRepositoryMock.findScheduleSlot,
    createTimeSlot: SettingsRepositoryMock.createTimeSlot,
    createSpecificDateSchedule: SettingsRepositoryMock.createSpecificDateSchedule,
    createSpecificDateTimeSlot: SettingsRepositoryMock.createSpecificDateTimeSlot,
    createScheduleException: SettingsRepositoryMock.createScheduleException,
    createKartCategory: SettingsRepositoryMock.createKartCategory,
    createSettingsUser: SettingsRepositoryMock.createSettingsUser,
    syncCategoryPricesFromKart: SettingsRepositoryMock.syncCategoryPricesFromKart,
    syncLevelRequirements: SettingsRepositoryMock.syncLevelRequirements,
    getSettingsKarts: () => SettingsRepositoryMock.getSettingsKarts(),
    getSettingsKartStatuses: () => SettingsRepositoryMock.getSettingsKartStatuses(),
    getFeedbackCriteria: () => SettingsRepositoryMock.getFeedbackCriteria(),
    getNotificationChannels: () => SettingsRepositoryMock.getNotificationChannels(),
    getNotificationEvents: () =>
      isHttpMode()
        ? SettingsRepositoryHttp.getNotificationEvents()
        : SettingsRepositoryMock.getNotificationEvents(),
    saveNotificationEvents: (
      events: Parameters<typeof SettingsRepositoryHttp.replaceNotificationEvents>[0],
    ) =>
      isHttpMode()
        ? SettingsRepositoryHttp.replaceNotificationEvents(events)
        : Promise.resolve(events),
    getIntegrations: () =>
      isHttpMode()
        ? SettingsRepositoryHttp.getIntegrations()
        : Promise.resolve(SettingsRepositoryMock.getIntegrations()),
    getSecurityCards: () =>
      isHttpMode()
        ? SettingsRepositoryHttp.getSecurityCards()
        : Promise.resolve(SettingsRepositoryMock.getSecurityCards()),
    getAppearanceSettings: () =>
      isHttpMode()
        ? SettingsRepositoryHttp.getAppearance()
        : Promise.resolve(SettingsRepositoryMock.getAppearanceSettings()),
    saveIntegrations: (
      integrations: Parameters<
        typeof SettingsRepositoryHttp.replaceIntegrations
      >[0],
    ) =>
      isHttpMode()
        ? SettingsRepositoryHttp.replaceIntegrations(integrations)
        : Promise.resolve(integrations),
    saveAppearanceSettings: (
      appearance: Parameters<typeof SettingsRepositoryHttp.replaceAppearance>[0],
    ) =>
      isHttpMode()
        ? SettingsRepositoryHttp.replaceAppearance(appearance)
        : Promise.resolve(appearance),
    getRankingSettings: () => SettingsRepositoryMock.getRankingSettings(),
    getDocumentTemplates: () =>
      isHttpMode()
        ? SettingsRepositoryHttp.getDocumentTemplates()
        : SettingsRepositoryMock.getDocumentTemplates(),
    saveDocumentTemplates: (
      documents: Parameters<typeof SettingsRepositoryHttp.replaceDocumentTemplates>[0],
    ) =>
      isHttpMode()
        ? SettingsRepositoryHttp.replaceDocumentTemplates(documents)
        : Promise.resolve(documents),
    getAuditLog: () => SettingsRepositoryMock.getAuditLog(),
    createSettingsKart: SettingsRepositoryMock.createSettingsKart,
    nextSettingsKartNumber: SettingsRepositoryMock.nextSettingsKartNumber,
    getTermsRegistry: () =>
      isHttpMode()
        ? SettingsRepositoryHttp.getTermsRegistry()
        : SettingsRepositoryMock.getTermsRegistry(),
    saveTermsRegistry: (
      registry: Parameters<typeof SettingsRepositoryHttp.replaceTermsRegistry>[0],
    ) =>
      isHttpMode()
        ? SettingsRepositoryHttp.replaceTermsRegistry(registry)
        : Promise.resolve(registry),
    getDreAccounts: () => SettingsRepositoryMock.getDreAccounts(),
    getFinancialCategories: () => SettingsRepositoryMock.getFinancialCategories(),
    getInventoryPartCategories: () =>
      SettingsRepositoryMock.getInventoryPartCategories(),
    getRegisteredMotorTerms: () => SettingsRepositoryMock.getRegisteredMotorTerms(),
    getRegisteredChassisTerms: () =>
      SettingsRepositoryMock.getRegisteredChassisTerms(),
    createDreAccountLine: SettingsRepositoryMock.createDreAccountLine,
    buildDreSections: SettingsRepositoryMock.buildDreSections,
    insertDreLineInGroup: SettingsRepositoryMock.insertDreLineInGroup,
    createFinancialCategory: SettingsRepositoryMock.createFinancialCategory,
    createInventoryPartCategory: SettingsRepositoryMock.createInventoryPartCategory,
    createRegisteredMotor: SettingsRepositoryMock.createRegisteredMotor,
    createRegisteredChassis: SettingsRepositoryMock.createRegisteredChassis,
    dreAccountKindLabel: SettingsRepositoryMock.dreAccountKindLabel,
    saveGeneralSettings: (data: {
      teamName?: string;
      logoUrl?: string;
      logo?: string;
      cnpj?: string;
      email?: string;
      whatsapp?: string;
      address?: string;
      instagram?: string;
      tiktok?: string;
      facebook?: string;
      institutionalText?: string;
    }) =>
      isHttpMode()
        ? SettingsRepositoryHttp.updateOrganization({
            teamName: data.teamName,
            logoUrl: data.logoUrl ?? data.logo,
            cnpj: data.cnpj,
            email: data.email,
            whatsapp: data.whatsapp,
            address: data.address,
            instagram: data.instagram,
            tiktok: data.tiktok,
            facebook: data.facebook,
            institutionalText: data.institutionalText,
          })
        : Promise.resolve(SettingsRepositoryMock.getGeneralSettings()),
  };
}

export type SettingsService = ReturnType<typeof createSettingsService>;
export const SettingsServiceMock = createSettingsService();
