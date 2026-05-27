import * as dashboardMocks from "@/lib/admin-dashboard-mocks";

export const DashboardRepositoryMock = {
  getNav: () => dashboardMocks.ADMIN_NAV,
  getProfile: () => dashboardMocks.ADMIN_PROFILE,
  getOperationStatus: () => dashboardMocks.ADMIN_OPERATION_STATUS,
  getHeroQuickStats: () => dashboardMocks.HERO_QUICK_STATS,
  getKpis: () => dashboardMocks.ADMIN_KPIS,
  getOperationalAgenda: () => dashboardMocks.OPERATIONAL_AGENDA,
  getStudentsOfTheMonth: () => dashboardMocks.STUDENTS_OF_THE_MONTH,
  getTelemetryEvolutionSeries: () => dashboardMocks.TELEMETRY_EVOLUTION_SERIES,
  getTelemetryInsight: () => dashboardMocks.TELEMETRY_INSIGHT,
  getTelemetrySectors: () => dashboardMocks.TELEMETRY_SECTORS,
  getKartFleet: () => dashboardMocks.KART_FLEET,
  getChampionship: () => dashboardMocks.CHAMPIONSHIP,
  getFinancial: () => dashboardMocks.FINANCIAL,
  getQuickActions: () => dashboardMocks.ADMIN_QUICK_ACTIONS,
};
