import type { ClientListItem } from "@/lib/contracts/clients";
import type {
  ClientDetailDTO,
  ClientListItemDTO,
} from "@/lib/contracts/api/v1/clients.api.schemas";
import {
  toCategoryUiId,
  toCategoryUiIds,
  toSkillLevelUiId,
} from "@/lib/reference-data/resolve-reference-ids";
import type {
  ScheduleBlockDTO,
  ScheduleEventDTO,
} from "@/lib/contracts/api/v1/schedule.api.schemas";
import type { ScheduleBlockEntry } from "@/repositories/schedule/ScheduleBlocksRepositoryMock";
import type { KartApiDTO } from "@/lib/contracts/api/v1/karts.api.schemas";
import type { LessonSessionApiDTO } from "@/lib/contracts/api/v1/lessons.api.schemas";
import type { ScheduleEvent } from "@/lib/contracts/schedule";
import type { FleetKartListItem } from "@/lib/admin-karts-mocks";
import {
  enrichFleetKartListItem,
  type FleetKartSeed,
} from "@/lib/karts/enrich-fleet-kart";
import type { PreventiveMaintenanceHoursState } from "@/lib/maintenance/preventive-maintenance";
import type { LessonSessionDTO } from "@/lib/contracts/lessons/lesson.types";
import type { LessonRegistrationDTO } from "@/lib/contracts/lessons/lesson-registration.types";
import { LessonStatus } from "@/lib/contracts/enums";
import type {
  PaymentStatus,
  ScheduleEventStatus,
  ScheduleEventType,
} from "@/lib/contracts/enums";

const TZ = "America/Sao_Paulo";

function formatDateInTz(date: Date): string {
  return date.toLocaleDateString("en-CA", { timeZone: TZ });
}

function formatTimeInTz(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TZ,
  });
}

function formatLapMs(ms: number): string {
  const totalSec = ms / 1000;
  return totalSec.toFixed(3);
}

export function mapScheduleBlockDtoToEntry(
  dto: ScheduleBlockDTO,
): ScheduleBlockEntry {
  return {
    id: dto.id,
    date: dto.blockDate,
    slotIds: [...dto.slotIds],
    fullDay: dto.fullDay,
    reason: dto.reason ?? "",
    createdAt: new Date().toISOString(),
  };
}

export function mapScheduleEventDtoToLegacy(dto: ScheduleEventDTO): ScheduleEvent {
  const startsAt = new Date(dto.startsAt);
  const endsAt = new Date(dto.endsAt);
  return {
    id: dto.id,
    date: formatDateInTz(startsAt),
    start: formatTimeInTz(startsAt),
    end: formatTimeInTz(endsAt),
    student: dto.clientName ?? "—",
    type: dto.type as ScheduleEventType,
    typeLabel: dto.typeLabel,
    kartNumber: dto.kartNumber ?? 0,
    kartId: dto.kartId ?? "",
    status: dto.status as ScheduleEventStatus,
    payment: (dto.paymentStatus ?? "pendente") as PaymentStatus,
    category: dto.categoryLabel ?? undefined,
    note: dto.notes ?? undefined,
    objective: dto.objective ?? undefined,
  };
}

export function mapClientListItemDtoToUi(
  dto: ClientListItemDTO,
  detail?: ClientDetailDTO | null,
): ClientListItem {
  return {
    id: dto.id,
    name: dto.name,
    avatar: dto.avatarUrl ?? "",
    categoryIds: toCategoryUiIds(dto.categoryIds ?? []),
    levelId: toSkillLevelUiId(dto.skillLevelId),
    status: dto.status,
    lastSession: "—",
    nextSession: "—",
    bestLap: detail?.bestLapMs != null ? formatLapMs(detail.bestLapMs) : "—",
    consistency: detail?.consistencyPct ?? 0,
    activePlan: "—",
    isMinor: dto.isMinor,
  };
}

export function mapKartDtoToFleetSeed(dto: KartApiDTO): FleetKartSeed {
  return {
    id: dto.id,
    number: dto.number,
    photo: dto.photoUrl?.trim() || "/images/gallery-1.jpg",
    categoryId: toCategoryUiId(dto.categoryId),
    categoryName: dto.categoryName ?? "—",
    ownership: dto.ownership,
    clientId: dto.clientId ?? undefined,
    ownerName: dto.clientName ?? undefined,
    status: dto.status,
    motor: dto.motorRef ?? "—",
    chassis: dto.chassisRef ?? "—",
    lastUse: "—",
    nextMaintenance: "—",
    nextMaintenanceDays: 0,
    usageHours: dto.engineHours ?? 0,
    preventiveMaintenanceHours: (dto.preventiveMaintenanceHours ??
      null) as PreventiveMaintenanceHoursState | null,
    fuel: "—",
    tires: "—",
    score: dto.status === "disponivel" ? 90 : 80,
  };
}

export function mapKartDtoToFleetItem(dto: KartApiDTO): FleetKartListItem {
  return enrichFleetKartListItem(mapKartDtoToFleetSeed(dto));
}

const LESSON_STATUS_FROM_API: Record<string, LessonStatus> = {
  aguardando: LessonStatus.SCHEDULED,
  em_andamento: LessonStatus.IN_PROGRESS,
  pendente_registro: LessonStatus.PENDING_REGISTRATION,
  concluida: LessonStatus.COMPLETED,
  cancelada: LessonStatus.CANCELLED,
};

export function mapLessonSessionDtoToUi(
  dto: LessonSessionApiDTO,
): LessonSessionDTO {
  return {
    id: dto.id,
    scheduleEventId: dto.scheduleEventId,
    date: dto.date,
    start: dto.start,
    end: dto.end,
    studentName: dto.studentName,
    studentId: dto.clientId ?? undefined,
    avatar: "/images/team-1.png",
    category: dto.category,
    typeLabel: dto.typeLabel,
    registeredByName: dto.registeredByName,
    kartNumber: dto.kartNumber,
    status: LESSON_STATUS_FROM_API[dto.status] ?? LessonStatus.SCHEDULED,
    objective: dto.objective ?? undefined,
    previousNote: dto.previousNote ?? undefined,
  };
}

export function mapLessonRegistrationPayloadToUi(
  sessionId: string,
  payload: NonNullable<LessonSessionApiDTO["registration"]>,
): LessonRegistrationDTO {
  return {
    sessionId,
    laps: payload.laps,
    notes: payload.notes,
    method: payload.method,
    telemetryId: payload.telemetrySessionId ?? undefined,
    savedAt: payload.registeredAt,
  };
}

export function addDaysIso(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
