import { getDataSourceMode } from "@/lib/data-source/mode";
import { mapAuthUserToAdminProfile } from "@/lib/admin/map-auth-user-to-admin-profile";
import type { AdminNavKey } from "@/lib/contracts/dashboard";
import { AuthRepositoryHttp } from "@/repositories/auth/AuthRepositoryHttp";
import { DashboardRepositoryHttp } from "@/repositories/dashboard/DashboardRepositoryHttp";
import { DashboardRepositoryMock } from "@/repositories/dashboard/DashboardRepositoryMock";

const DASHBOARD_KPI_EXCLUDE = new Set(["treinos", "evolucao"]);

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

export function createDashboardService() {
  return {
    getNav: () => DashboardRepositoryMock.getNav(),
    getProfile: async () => {
      if (!isHttpMode()) {
        return DashboardRepositoryMock.getProfile();
      }
      try {
        const session = await AuthRepositoryHttp.getSession();
        return mapAuthUserToAdminProfile(session.user);
      } catch {
        return DashboardRepositoryMock.getProfile();
      }
    },
    getOperationStatus: () => DashboardRepositoryMock.getOperationStatus(),
    getHeroQuickStats: () => DashboardRepositoryMock.getHeroQuickStats(),
    getKpis: () =>
      isHttpMode()
        ? DashboardRepositoryHttp.getDashboardKpis()
        : Promise.resolve(DashboardRepositoryMock.getKpis()),
    getDashboardSummary: async () => {
      if (isHttpMode()) {
        return DashboardRepositoryHttp.getSummary();
      }
      const financial = DashboardRepositoryMock.getFinancial();
      return {
        kpis: DashboardRepositoryMock.getKpis().filter(
          (k) => !DASHBOARD_KPI_EXCLUDE.has(k.id),
        ),
        operationalAgenda: DashboardRepositoryMock.getOperationalAgenda(),
        kartFleet: DashboardRepositoryMock.getKartFleet(),
        financial: {
          receivableTotal: financial.monthlyRevenue ?? "—",
          delinquentTotal: financial.delinquency ?? "—",
          revenueMonth: financial.monthlyRevenue ?? "—",
        },
      };
    },
    getDashboardKpis: () =>
      isHttpMode()
        ? DashboardRepositoryHttp.getDashboardKpis()
        : Promise.resolve(
            DashboardRepositoryMock.getKpis().filter(
              (k) => !DASHBOARD_KPI_EXCLUDE.has(k.id),
            ),
          ),
    getOperationalAgenda: () =>
      isHttpMode()
        ? DashboardRepositoryHttp.getOperationalAgenda()
        : Promise.resolve(DashboardRepositoryMock.getOperationalAgenda()),
    getStudentsOfTheMonth: () =>
      DashboardRepositoryMock.getStudentsOfTheMonth(),
    getTelemetryEvolutionSeries: () =>
      DashboardRepositoryMock.getTelemetryEvolutionSeries(),
    getTelemetryInsight: () => DashboardRepositoryMock.getTelemetryInsight(),
    getTelemetrySectors: () => DashboardRepositoryMock.getTelemetrySectors(),
    getKartFleet: () =>
      isHttpMode()
        ? DashboardRepositoryHttp.getKartFleet()
        : Promise.resolve(DashboardRepositoryMock.getKartFleet()),
    getFinancial: () => DashboardRepositoryMock.getFinancial(),
    getQuickActions: () => DashboardRepositoryMock.getQuickActions(),
  };
}

export type DashboardService = ReturnType<typeof createDashboardService>;
export type { AdminNavKey };
export const DashboardServiceMock = createDashboardService();
