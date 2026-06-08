import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import type { AdminKpi } from "@/lib/contracts/dashboard";

type DashboardSummary = {
  kpis: AdminKpi[];
  operationalAgenda: {
    id: string;
    startTime: string;
    endTime: string;
    pilotName: string;
    category: string;
    level: string;
  }[];
  kartFleet: {
    id: string;
    number: number;
    status: string;
    ownership: string;
    ownerName?: string;
  }[];
  financial: {
    receivableTotal: string;
    delinquentTotal: string;
    revenueMonth: string;
  };
};

export const DashboardRepositoryHttp = {
  async getSummary(): Promise<DashboardSummary> {
    const res = await apiFetch<DashboardSummary>(v1ApiPaths.dashboard.summary);
    return unwrapApiResponse(res);
  },

  async getDashboardKpis(): Promise<AdminKpi[]> {
    const summary = await DashboardRepositoryHttp.getSummary();
    return summary.kpis;
  },

  async getOperationalAgenda() {
    const summary = await DashboardRepositoryHttp.getSummary();
    return summary.operationalAgenda;
  },

  async getKartFleet() {
    const summary = await DashboardRepositoryHttp.getSummary();
    return summary.kartFleet;
  },

  async getFinancial() {
    const summary = await DashboardRepositoryHttp.getSummary();
    return summary.financial;
  },
};
