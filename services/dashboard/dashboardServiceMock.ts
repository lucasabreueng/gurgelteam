import type { AdminNavKey } from "@/lib/contracts/dashboard";
import { DashboardRepositoryMock } from "@/repositories/dashboard/DashboardRepositoryMock";

const DASHBOARD_KPI_EXCLUDE = new Set(["treinos", "evolucao"]);

export const DashboardServiceMock = {
  getNav: () => DashboardRepositoryMock.getNav(),
  getProfile: () => DashboardRepositoryMock.getProfile(),
  getOperationStatus: () => DashboardRepositoryMock.getOperationStatus(),
  getHeroQuickStats: () => DashboardRepositoryMock.getHeroQuickStats(),
  getKpis: () => DashboardRepositoryMock.getKpis(),
  getDashboardKpis: () =>
    DashboardRepositoryMock.getKpis().filter((k) => !DASHBOARD_KPI_EXCLUDE.has(k.id)),
  getOperationalAgenda: () => DashboardRepositoryMock.getOperationalAgenda(),
  getStudentsOfTheMonth: () => DashboardRepositoryMock.getStudentsOfTheMonth(),
  getTelemetryEvolutionSeries: () => DashboardRepositoryMock.getTelemetryEvolutionSeries(),
  getTelemetryInsight: () => DashboardRepositoryMock.getTelemetryInsight(),
  getTelemetrySectors: () => DashboardRepositoryMock.getTelemetrySectors(),
  getKartFleet: () => DashboardRepositoryMock.getKartFleet(),
  getChampionship: () => DashboardRepositoryMock.getChampionship(),
  getFinancial: () => DashboardRepositoryMock.getFinancial(),
  getQuickActions: () => DashboardRepositoryMock.getQuickActions(),
};

export type { AdminNavKey };
