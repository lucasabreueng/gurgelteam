import type { MaintenanceOrderApiDTO } from "@/lib/contracts/api/v1/maintenance.api.schemas";
import type {
  ChecklistGroup,
  ChecklistItemStatus,
  MaintenanceOrderDetail,
  MaintenanceOrderListItem,
  MaintenancePart,
  MaintenancePriority,
  MaintenanceStatus,
  MaintenanceType,
} from "@/lib/contracts/maintenance";
import type { SimpleMaintenanceStatus } from "@/lib/contracts/enums";
import { formatCentsBrl } from "@/lib/server/format-money";

const DEFAULT_PHOTO = "/images/kart-01.jpg";

function mapSimpleStatusToUi(status: SimpleMaintenanceStatus): MaintenanceStatus {
  switch (status) {
    case "pendente":
      return "aguardando_analise";
    case "em_andamento":
      return "em_manutencao";
    case "concluida":
      return "finalizado";
    default:
      return "detectado";
  }
}

function formatOpenedAt(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function stoppedDaysFrom(iso: string) {
  const start = new Date(iso).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - start) / 86400000));
}

export function mapMaintenanceOrderApiToListItem(
  order: MaintenanceOrderApiDTO,
): MaintenanceOrderListItem {
  const priority: MaintenancePriority =
    order.status === "pendente"
      ? "media"
      : order.status === "em_andamento"
        ? "alta"
        : "baixa";
  const type: MaintenanceType = "corretiva";

  return {
    id: order.id,
    osNumber: `OS-${order.id.slice(0, 8).toUpperCase()}`,
    kartId: order.kartId,
    kartNumber: order.kartNumber ?? 0,
    kartPhoto: DEFAULT_PHOTO,
    categoryId: "frota",
    categoryName: "Frota",
    ownership: "rental",
    problem: order.title,
    priority,
    status: mapSimpleStatusToUi(order.status),
    type,
    mechanicId: order.assignedTo ?? "",
    mechanicName: order.assignedTo ?? "Equipe técnica",
    openedAt: formatOpenedAt(order.detectedAt),
    stoppedDays: stoppedDaysFrom(order.detectedAt),
    partsNeeded: [],
  };
}

function mapItemStatus(value: unknown): ChecklistItemStatus {
  const raw = String(value ?? "").toLowerCase();
  if (
    raw === "fail" ||
    raw === "reprovado" ||
    raw === "necessita_manutencao" ||
    raw === "critico"
  ) {
    return "fail";
  }
  if (raw === "warn" || raw === "atencao" || raw === "attention") {
    return "warn";
  }
  return "ok";
}

function mapChecklistDataToGroups(data: unknown): ChecklistGroup[] {
  if (!data) return [];

  if (Array.isArray(data)) {
    return data
      .filter(
        (group): group is { title: string; items: unknown[] } =>
          typeof group === "object" &&
          group !== null &&
          typeof (group as { title?: unknown }).title === "string" &&
          Array.isArray((group as { items?: unknown }).items),
      )
      .map((group) => ({
        title: group.title,
        items: group.items
          .filter(
            (item): item is { id: string; label: string; status?: unknown } =>
              typeof item === "object" &&
              item !== null &&
              typeof (item as { id?: unknown }).id === "string" &&
              typeof (item as { label?: unknown }).label === "string",
          )
          .map((item) => ({
            id: item.id,
            label: item.label,
            status: mapItemStatus(item.status),
          })),
      }))
      .filter((group) => group.items.length > 0);
  }

  if (typeof data === "object" && data !== null && "items" in data) {
    const items = (data as { items: Record<string, unknown> }).items;
    if (items && typeof items === "object") {
      return [
        {
          title: "Checklist",
          items: Object.entries(items).map(([id, value]) => ({
            id,
            label: id.replace(/_/g, " "),
            status:
              typeof value === "object" && value !== null && "status" in value
                ? mapItemStatus((value as { status?: unknown }).status)
                : mapItemStatus(value),
          })),
        },
      ];
    }
  }

  return [];
}

function mapApiPartsToUi(
  parts: NonNullable<
    import("@/lib/contracts/api/v1/maintenance.api.schemas").MaintenanceOrderDetailApiDTO["parts"]
  >,
): MaintenancePart[] {
  return parts.map((part) => ({
    id: part.id,
    name: part.name,
    supplier: part.supplierName,
    qty: part.qty,
    cost: formatCentsBrl(part.unitCostCents * part.qty),
    status: "instalado",
    eta: "—",
  }));
}

export function buildMaintenanceOrderDetailFromApi(
  order: import("@/lib/contracts/api/v1/maintenance.api.schemas").MaintenanceOrderDetailApiDTO,
): MaintenanceOrderDetail {
  const listItem = mapMaintenanceOrderApiToListItem(order);
  const dateTime = new Date(order.detectedAt).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    order: listItem,
    eta: "—",
    problemReport: {
      text: order.description?.trim() || order.title,
      identifiedBy: order.assignedTo ?? "Equipe técnica",
      dateTime,
      media: [],
      technicalNotes: order.description?.trim() || "",
    },
    checklist: mapChecklistDataToGroups(order.checklistData),
    parts: order.parts?.length ? mapApiPartsToUi(order.parts) : [],
    engineHours: {
      motor: 0,
      remaining: 0,
      preventive: "—",
      oil: "—",
      tires: "—",
      ratio: "—",
      alerts: [],
    },
    tests: {
      performed: false,
      pilot: "—",
      notes: "",
      approved: false,
      released: order.status === "concluida",
    },
    history: [
      {
        id: `${order.id}-opened`,
        date: listItem.openedAt,
        title: "OS aberta",
        detail: order.title,
      },
    ],
    metrics: {
      monthlyCost: [],
      topParts: [],
      avgStopped: [],
      failures: [],
      problematicKarts: [],
      availability: [],
    },
  };
}
