import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import type {
  CreateMaintenanceOrderRequest,
  MaintenanceOrderApiDTO,
  MaintenanceOrderDetailApiDTO,
} from "@/lib/contracts/api/v1/maintenance.api.schemas";
import { buildMaintenanceSimpleKpis } from "@/lib/maintenance/build-maintenance-simple-kpis";
import type { MaintenanceSimpleKpi } from "@/lib/contracts/maintenance";
import type {
  MaintenanceOrderDetail,
  MaintenanceOrderListItem,
  SimpleMaintenanceRow,
} from "@/lib/contracts/maintenance";
import {
  buildMaintenanceOrderDetailFromApi,
  mapMaintenanceOrderApiToListItem,
} from "@/lib/maintenance/map-order-api";

type MaintenanceStats = {
  openOrders: number;
  inProgress: number;
  disponiveis: number;
  manutencao: number;
  pendingInspections: number;
  atencao?: number;
  monthlyCostCents?: number;
  checklistsThisMonth?: number;
  pendingChecklists?: number;
  lastChecklistLabel?: string;
};

function mapOrderToSimpleRow(
  order: MaintenanceOrderApiDTO,
): SimpleMaintenanceRow {
  const date = new Date(order.detectedAt).toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "short",
  });
  return {
    id: order.id,
    date,
    kartId: order.kartId,
    kartNumber: order.kartNumber ?? 0,
    type: "corretiva",
    category: "outros",
    description: order.title,
    status: order.status,
    costCents: 0,
  };
}

export const MaintenanceRepositoryHttp = {
  async listOrderListItems(): Promise<MaintenanceOrderListItem[]> {
    const orders = await MaintenanceRepositoryHttp.listOrders();
    return orders.map(mapMaintenanceOrderApiToListItem);
  },

  async getOrderById(orderId: string): Promise<MaintenanceOrderDetailApiDTO | null> {
    const res = await apiFetch<MaintenanceOrderDetailApiDTO>(
      v1ApiPaths.maintenance.orderById(orderId),
    );
    if (!res.success) {
      if (res.error?.httpStatus === 404) return null;
      unwrapApiResponse(res);
    }
    return res.data ?? null;
  },

  async getOrderDetail(orderId: string): Promise<MaintenanceOrderDetail | null> {
    const order = await MaintenanceRepositoryHttp.getOrderById(orderId);
    if (!order) return null;
    return buildMaintenanceOrderDetailFromApi(order);
  },

  async createOrder(payload: CreateMaintenanceOrderRequest) {
    const res = await apiFetch<MaintenanceOrderApiDTO>(v1ApiPaths.maintenance.orders, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return unwrapApiResponse(res);
  },

  async listOrders(): Promise<MaintenanceOrderApiDTO[]> {
    const res = await apiFetch<MaintenanceOrderApiDTO[]>(
      v1ApiPaths.maintenance.orders,
    );
    return unwrapApiResponse(res);
  },

  async getStats(): Promise<MaintenanceStats> {
    const res = await apiFetch<MaintenanceStats>(v1ApiPaths.maintenance.stats);
    return unwrapApiResponse(res);
  },

  async getSimpleKpis(): Promise<MaintenanceSimpleKpi[]> {
    const stats = await MaintenanceRepositoryHttp.getStats();
    return buildMaintenanceSimpleKpis({
      ...stats,
      pendingInspections: stats.pendingInspections,
    });
  },

  async getMaintenancesList(): Promise<SimpleMaintenanceRow[]> {
    const orders = await MaintenanceRepositoryHttp.listOrders();
    return orders.map(mapOrderToSimpleRow);
  },

  async getKartTechnicalTimeline(
    kartId: string,
  ): Promise<import("@/lib/contracts/maintenance/complete-checklist").KartTechnicalTimelineEntry[]> {
    const res = await apiFetch<
      import("@/lib/contracts/maintenance/complete-checklist").KartTechnicalTimelineEntry[]
    >(v1ApiPaths.karts.technicalTimeline(kartId));
    return unwrapApiResponse(res);
  },

  async getKartById(kartId: string) {
    const res = await apiFetch<{ id: string; number: number }>(
      v1ApiPaths.karts.byId(kartId),
    );
    if (!res.success || !res.data) return undefined;
    return { id: res.data.id, number: res.data.number };
  },
};
