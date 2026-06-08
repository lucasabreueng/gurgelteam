import type {
  Kart,
  KartCategory,
  Client,
  MaintenanceOrder,
  ScheduleEvent,
} from "@prisma/client";

import { KART_STATUS_LABELS } from "@/lib/admin-karts-mocks";
import type {
  FleetKartListItem,
  KartDetail,
  KartUsageEvent,
  MaintenanceItem,
} from "@/lib/admin-karts-mocks";
import type { KartStatus } from "@/lib/contracts/enums";
import { enrichFleetKartListItem } from "@/lib/karts/enrich-fleet-kart";
import type { PreventiveMaintenanceHoursState } from "@/lib/maintenance/preventive-maintenance";
import { toCategoryUiId } from "@/lib/reference-data/resolve-reference-ids";

const TZ = "America/Sao_Paulo";

type KartDetailSource = Kart & {
  category: KartCategory;
  clientOwner?: Client | null;
  scheduleEvents: (ScheduleEvent & { client?: Client | null })[];
  maintenanceOrders: MaintenanceOrder[];
};

function formatDatePt(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    timeZone: TZ,
  });
}

function formatRelativeUse(date: Date): string {
  const today = new Date();
  const sameDay = date.toLocaleDateString("en-CA", { timeZone: TZ }) ===
    today.toLocaleDateString("en-CA", { timeZone: TZ });
  if (sameDay) {
    return `Hoje, ${date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: TZ,
    })}`;
  }
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.toLocaleDateString("en-CA", { timeZone: TZ }) ===
    yesterday.toLocaleDateString("en-CA", { timeZone: TZ });
  if (isYesterday) {
    return `Ontem, ${date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: TZ,
    })}`;
  }
  return formatDatePt(date);
}

function formatDuration(startsAt: Date, endsAt: Date): string {
  const minutes = Math.round((endsAt.getTime() - startsAt.getTime()) / 60_000);
  if (minutes <= 0) return "";
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem > 0 ? `${hours}h${rem}min` : `${hours}h`;
}

function mapUsageType(
  type: string,
): KartUsageEvent["type"] {
  if (type.startsWith("aula")) return "aula";
  if (type.startsWith("treino")) return "treino";
  return "evento";
}

function scoreFromStatus(status: KartStatus): number {
  switch (status) {
    case "disponivel":
      return 90;
    case "em_treino":
    case "reservado":
      return 85;
    case "preparacao":
    case "lavagem":
      return 80;
    case "aguardando_peca":
      return 65;
    case "manutencao":
      return 70;
    case "indisponivel":
      return 55;
    default:
      return 75;
  }
}

function availabilityLabel(status: KartStatus): string {
  switch (status) {
    case "disponivel":
      return "Pronto para pista";
    case "em_treino":
      return "Em uso agora";
    case "reservado":
      return "Reservado na agenda";
    case "manutencao":
    case "aguardando_peca":
    case "lavagem":
    case "preparacao":
      return "Indisponível temporariamente";
    default:
      return KART_STATUS_LABELS[status] ?? "—";
  }
}

function computeNextMaintenanceDays(
  lastMaintenanceAt: Date | null | undefined,
): number {
  if (!lastMaintenanceAt) return 30;
  const daysSince = Math.floor(
    (Date.now() - lastMaintenanceAt.getTime()) / 86_400_000,
  );
  return Math.max(-30, 30 - daysSince);
}

function formatNextMaintenance(
  lastMaintenanceAt: Date | null | undefined,
  days: number,
): string {
  if (!lastMaintenanceAt) return "—";
  if (days < 0) return "Atrasada";
  if (days === 0) return "Em andamento";
  const target = new Date(lastMaintenanceAt);
  target.setDate(target.getDate() + 30);
  return formatDatePt(target);
}

function mapMaintenanceStatus(status: string): MaintenanceItem["status"] {
  if (status === "concluida") return "Concluído";
  if (status === "em_andamento") return "Em andamento";
  return "Pendente";
}

function mapMaintenanceKind(status: string): MaintenanceItem["kind"] {
  return status === "concluida" ? "corretiva" : "preventiva";
}

function mapFleetListItem(kart: KartDetailSource): FleetKartListItem {
  const status = kart.status as KartStatus;
  const engineHours =
    kart.engineHours != null ? Number(kart.engineHours) : 0;
  const lastEvent = kart.scheduleEvents[0];
  const preventiveHours = parsePreventiveHours(
    (kart as Kart & { preventiveMaintenanceHours?: unknown })
      .preventiveMaintenanceHours,
  );

  const seed = {
    id: kart.id,
    number: kart.number,
    photo: kart.photoUrl?.trim() || "/images/gallery-1.jpg",
    categoryId: toCategoryUiId(kart.categoryId),
    categoryName: kart.category.name,
    ownership: kart.ownership === "client" ? ("client" as const) : ("rental" as const),
    clientId: kart.clientId ?? undefined,
    ownerName: kart.clientOwner?.name,
    status,
    motor: kart.motorRef ?? "—",
    chassis: kart.chassisRef ?? "—",
    lastUse: lastEvent ? formatRelativeUse(lastEvent.startsAt) : "—",
    nextMaintenance: "—",
    nextMaintenanceDays: 0,
    usageHours: engineHours,
    preventiveMaintenanceHours: preventiveHours as PreventiveMaintenanceHoursState | null,
    fuel: "—",
    tires: "—",
    score: scoreFromStatus(status),
  } satisfies Parameters<typeof enrichFleetKartListItem>[0];

  return enrichFleetKartListItem(seed);
}

function parsePreventiveHours(value: unknown): Record<string, number> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const result: Record<string, number> = {};
  for (const [key, hours] of Object.entries(value as Record<string, unknown>)) {
    if (typeof hours === "number" && Number.isFinite(hours)) {
      result[key] = hours;
    }
  }
  return Object.keys(result).length > 0 ? result : null;
}

function mapUsageHistory(
  events: KartDetailSource["scheduleEvents"],
): KartUsageEvent[] {
  return events.map((event) => ({
    id: event.id,
    date: formatRelativeUse(event.startsAt),
    type: mapUsageType(event.type),
    title: event.type.replace(/_/g, " "),
    pilot: event.client?.name ?? "—",
    duration: formatDuration(event.startsAt, event.endsAt),
    note: event.notes ?? undefined,
  }));
}

function mapMaintenanceItems(
  orders: MaintenanceOrder[],
): MaintenanceItem[] {
  return orders.map((order) => ({
    id: order.id,
    area: order.title,
    kind: mapMaintenanceKind(order.status),
    lastDone: formatDatePt(order.detectedAt),
    nextDue: order.closedAt ? "—" : "Pendente",
    cost: "—",
    responsible: order.assignedTo ?? "—",
    status: mapMaintenanceStatus(order.status),
    notes: order.description ?? "",
  }));
}

function mapUpcomingSchedule(
  events: KartDetailSource["scheduleEvents"],
): KartDetail["schedule"] {
  const upcoming = events.filter(
    (event) => event.startsAt.getTime() >= Date.now(),
  );
  const byDay = new Map<string, KartDetail["schedule"][number]["slots"]>();

  for (const event of upcoming) {
    const day = event.startsAt.toLocaleDateString("pt-BR", {
      weekday: "short",
      timeZone: TZ,
    });
    const slots = byDay.get(day) ?? [];
    slots.push({
      time: event.startsAt.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: TZ,
      }),
      label: event.type.replace(/_/g, " "),
      tone: "navy",
    });
    byDay.set(day, slots);
  }

  return Array.from(byDay.entries()).map(([day, slots]) => ({ day, slots }));
}

export function mapKartToDetail(kart: KartDetailSource): KartDetail {
  const list = mapFleetListItem(kart);
  const status = kart.status as KartStatus;
  const engineHours =
    kart.engineHours != null ? Number(kart.engineHours) : 0;

  return {
    list,
    heroBg: "/images/hero-image.jpg",
    reliabilityScore: list.score,
    availability: availabilityLabel(status),
    usageHistory: mapUsageHistory(kart.scheduleEvents),
    maintenance: mapMaintenanceItems(kart.maintenanceOrders),
    tires: {
      model: "—",
      compound: "—",
      wear: 0,
      cycles: 0,
      changedAt: "—",
      idealPressure: "—",
      replaceAlert: "Sem dados",
    },
    engine: {
      hours: engineHours,
      lastRevision: kart.lastMaintenanceAt
        ? formatDatePt(kart.lastMaintenanceAt)
        : "—",
      prep: "—",
      tuning: kart.motorRef ?? "—",
      performance: status === "disponivel" ? "Estável" : "Monitorar",
      interventions: kart.maintenanceOrders
        .slice(0, 3)
        .map((order) => order.title),
    },
    checklist: [],
    schedule: mapUpcomingSchedule(kart.scheduleEvents),
    financial: {
      revenue: "—",
      maintenanceCost: "—",
      parts: "—",
      profit: "—",
      pending: "—",
      margin: "—",
    },
    clientInfo:
      kart.ownership === "client" && kart.clientOwner
        ? {
            phone: kart.clientOwner.phone ?? "—",
            whatsapp: kart.clientOwner.phone ?? "—",
            box: "—",
            authorizedServices: [],
            pending: "—",
            contact: kart.clientOwner.name,
            internalNotes: "—",
            entryDate: formatDatePt(kart.clientOwner.createdAt),
            pickupEstimate: "—",
          }
        : undefined,
    documents: [],
    telemetry: {
      maxSpeedKmh: "—",
      minRpm: "—",
      maxRpm: "—",
      avgLap: "—",
      bestLap: "—",
      sessionsCount: 0,
    },
  };
}

export const kartDetailInclude = {
  category: true,
  clientOwner: true,
  scheduleEvents: {
    where: { status: { not: "cancelado" } },
    orderBy: { startsAt: "desc" as const },
    take: 20,
    include: { client: true },
  },
  maintenanceOrders: {
    orderBy: { detectedAt: "desc" as const },
    take: 12,
  },
} as const;
