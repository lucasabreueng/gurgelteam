import { COMPLETE_CHECKLIST_TYPE_LABELS } from "@/lib/contracts/maintenance/complete-checklist";
import type { MaintenanceFleetKart } from "@/lib/contracts/maintenance/simple";
import {
  buildCorrectiveMaintenanceSummary,
  buildMaintenanceFleetKart,
} from "@/lib/maintenance/build-maintenance-fleet-kart";
import type { PreventiveMaintenanceHoursState } from "@/lib/maintenance/preventive-maintenance";
import { prisma } from "@/lib/server/prisma";

const TZ = "America/Sao_Paulo";
const COMPLETE_TYPES = new Set(Object.keys(COMPLETE_CHECKLIST_TYPE_LABELS));

function parsePreventiveHours(
  value: unknown,
): PreventiveMaintenanceHoursState | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const result: PreventiveMaintenanceHoursState = {};
  for (const [key, hours] of Object.entries(value as Record<string, unknown>)) {
    if (typeof hours === "number" && Number.isFinite(hours)) {
      result[key as keyof PreventiveMaintenanceHoursState] = hours;
    }
  }
  return Object.keys(result).length > 0 ? result : null;
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    timeZone: TZ,
  });
}

/** Frota da aba Karts em /admin/manutencao (dados reais do banco). */
export async function buildMaintenanceFleetFromDb(): Promise<
  MaintenanceFleetKart[]
> {
  const [karts, orders, inspections] = await Promise.all([
    prisma.kart.findMany({
      orderBy: { number: "asc" },
      select: {
        id: true,
        number: true,
        status: true,
        photoUrl: true,
        engineHours: true,
        preventiveMaintenanceHours: true,
      },
    }),
    prisma.maintenanceOrder.findMany({
      orderBy: { detectedAt: "desc" },
      select: {
        id: true,
        kartId: true,
        title: true,
        status: true,
        detectedAt: true,
      },
    }),
    prisma.maintenanceInspection.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        kartId: true,
        checklistType: true,
        overallStatus: true,
        payload: true,
        createdAt: true,
      },
    }),
  ]);

  return karts.map((kart) => {
    const kartOrders = orders.filter((order) => order.kartId === kart.id);
    const kartInspections = inspections.filter(
      (inspection) => inspection.kartId === kart.id,
    );

    const openOrder = kartOrders.find(
      (order) => order.status === "pendente" || order.status === "em_andamento",
    );

    const openChecklist = kartInspections.find((row) => {
      if (!COMPLETE_TYPES.has(row.checklistType)) return false;
      const payload = row.payload as { finalStatus?: string } | null;
      const finalStatus = payload?.finalStatus ?? row.overallStatus;
      return finalStatus !== "aprovado" && finalStatus !== "concluido";
    });

    const checklistLabel = openChecklist
      ? `Checklist — ${
          COMPLETE_CHECKLIST_TYPE_LABELS[
            openChecklist.checklistType as keyof typeof COMPLETE_CHECKLIST_TYPE_LABELS
          ] ?? openChecklist.checklistType
        }`
      : null;

    const lastInspectionRow = kartInspections[0];
    const lastInspection = lastInspectionRow
      ? formatShortDate(lastInspectionRow.createdAt)
      : "—";

    const lastMaintenanceOrder = kartOrders.find(
      (order) => order.status === "concluida",
    );

    const lastMaintenance = openOrder
      ? "Em andamento"
      : lastMaintenanceOrder
        ? formatShortDate(lastMaintenanceOrder.detectedAt)
        : "—";

    return buildMaintenanceFleetKart({
      id: kart.id,
      number: kart.number,
      photo: kart.photoUrl?.trim() || "/images/gallery-1.jpg",
      status: kart.status,
      engineHours:
        kart.engineHours != null ? Number(kart.engineHours) : 0,
      preventiveMaintenanceHours: parsePreventiveHours(
        kart.preventiveMaintenanceHours,
      ),
      lastInspection,
      lastMaintenance,
      monthlyCostCents: 0,
      correctiveMaintenance: buildCorrectiveMaintenanceSummary({
        openChecklistLabel: checklistLabel,
        openOrderLabel: openOrder?.title ?? null,
      }),
    });
  });
}
