import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import type { ApiError } from "@/lib/contracts/api/api-error";
import type {
  CreateMaintenanceOrderRequest,
  UpdateMaintenanceOrderRequest,
} from "@/lib/contracts/api/v1/maintenance.api.schemas";
import { prisma } from "@/lib/server/prisma";
import { mapMaintenanceOrderToApi, mapMaintenanceOrderToDetailApi } from "@/lib/server/maintenance/map-maintenance";

function notFoundError(): ApiError {
  return {
    code: API_ERROR_CODES.NOT_FOUND,
    message: "Ordem de manutenção não encontrada.",
    httpStatus: 404,
  };
}

export const maintenanceRepository = {
  async listOrders() {
    const rows = await prisma.maintenanceOrder.findMany({
      include: { kart: { select: { number: true } } },
      orderBy: { detectedAt: "desc" },
    });
    return rows.map(mapMaintenanceOrderToApi);
  },

  async getOrderById(orderId: string) {
    const row = await prisma.maintenanceOrder.findUnique({
      where: { id: orderId },
      include: {
        kart: { select: { number: true } },
        parts: {
          include: {
            part: { include: { supplier: true } },
          },
        },
      },
    });
    if (!row) return null;
    return mapMaintenanceOrderToDetailApi(row);
  },

  async createOrder(data: CreateMaintenanceOrderRequest) {
    const row = await prisma.maintenanceOrder.create({
      data: {
        kartId: data.kartId,
        title: data.title,
        description: data.description ?? null,
        assignedTo: data.assignedTo ?? null,
        detectedAt: new Date(),
        status: "pendente",
      },
      include: { kart: { select: { number: true } } },
    });
    return mapMaintenanceOrderToApi(row);
  },

  async updateOrder(orderId: string, data: UpdateMaintenanceOrderRequest) {
    const existing = await prisma.maintenanceOrder.findUnique({
      where: { id: orderId },
    });
    if (!existing) throw notFoundError();

    const row = await prisma.maintenanceOrder.update({
      where: { id: orderId },
      data: {
        ...(data.status ? { status: data.status } : {}),
        ...(data.title ? { title: data.title } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.assignedTo !== undefined
          ? { assignedTo: data.assignedTo }
          : {}),
        ...(data.status === "concluida"
          ? { closedAt: new Date() }
          : {}),
      },
      include: { kart: { select: { number: true } } },
    });
    return mapMaintenanceOrderToApi(row);
  },

  async getStats() {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [orders, karts, inspections, checklistsMonth, pendingChecklists, lastChecklist] =
      await Promise.all([
        prisma.maintenanceOrder.findMany(),
        prisma.kart.findMany({ select: { status: true } }),
        prisma.maintenanceInspection.count({
          where: {
            OR: [
              { overallStatus: null },
              { overallStatus: { in: ["atencao", "pendente"] } },
            ],
          },
        }),
        prisma.maintenanceInspection.count({
          where: { createdAt: { gte: monthStart } },
        }),
        prisma.maintenanceInspection.count({
          where: { overallStatus: { in: ["atencao", "pendente"] } },
        }),
        prisma.maintenanceInspection.findFirst({
          orderBy: { createdAt: "desc" },
          include: { kart: { select: { number: true } } },
        }),
      ]);

    const openOrders = orders.filter((o) => o.status !== "concluida");
    const inProgress = orders.filter((o) => o.status === "em_andamento");
    const disponiveis = karts.filter((k) => k.status === "disponivel").length;
    const manutencao = karts.filter(
      (k) => k.status === "manutencao" || k.status === "aguardando_peca",
    ).length;
    const atencao = karts.filter((k) =>
      ["reservado", "preparacao", "lavagem"].includes(k.status),
    ).length;

    const monthlyCostCents = 0;

    const lastChecklistLabel = lastChecklist
      ? `${lastChecklist.createdAt.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
        })} · Kart ${lastChecklist.kart.number}`
      : "—";

    return {
      openOrders: openOrders.length,
      inProgress: inProgress.length,
      disponiveis,
      manutencao,
      pendingInspections: inspections,
      atencao,
      monthlyCostCents,
      checklistsThisMonth: checklistsMonth,
      pendingChecklists,
      lastChecklistLabel,
    };
  },
};

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value
  );
}
