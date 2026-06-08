import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { User } from "@prisma/client";

import { mapScheduleEventDtoToLegacy } from "@/lib/api/mappers/v1-mappers";
import { resolveClientAvatarUrl } from "@/lib/client-avatar";
import type { PilotBookingSlotsApiDTO } from "@/lib/contracts/api/v1/pilot.api.schemas";
import {
  toCategoryUiId,
  toSkillLevelUiId,
} from "@/lib/reference-data/resolve-reference-ids";
import { buildGurgelTimelineWithEvents } from "@/lib/schedule/gurgel-timeline";
import { listGuardianBookingClients } from "@/lib/server/pilot/list-guardian-booking-clients";
import { pilotRepository } from "@/lib/server/pilot/pilot-repository";
import { loadPilotBookingDayContext } from "@/lib/server/pilot/load-pilot-booking-day-context";

function formatDateLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  const label = format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Grade agregada: união de horários elegíveis do titular e pilotos vinculados. */
export async function buildGuardianBookingSlots(
  user: User,
  isoDate: string,
): Promise<PilotBookingSlotsApiDTO | null> {
  if (!user.clientId) return null;

  const targets = await listGuardianBookingClients(user, {
    includeLinkedPilots: true,
  });
  if (targets.length === 0) return null;

  const dayContext = await loadPilotBookingDayContext(isoDate);
  const legacyEvents = dayContext.eventsResult
    .filter(
      (dto) =>
        dto.type !== "bloqueio_pista" &&
        dto.type !== "manutencao" &&
        dto.status !== "cancelado",
    )
    .map(mapScheduleEventDtoToLegacy);

  type AggregatedSlot = PilotBookingSlotsApiDTO["slots"][number];

  const slotMap = new Map<string, AggregatedSlot>();

  for (const target of targets) {
    const profile = await pilotRepository.getProfile(target.clientId);
    if (!profile) continue;

    const pilotCategoryIds = profile.categoryIds.map((id) => toCategoryUiId(id));
    const studentLevelId = profile.skillLevelId
      ? toSkillLevelUiId(profile.skillLevelId)
      : undefined;

    const timelineSlots = buildGurgelTimelineWithEvents(
      isoDate,
      { categoryIds: pilotCategoryIds, studentLevelId },
      legacyEvents,
      dayContext.blockedSlotIds,
      dayContext.scheduleSlots,
    );

    for (const slot of timelineSlots) {
      if (slot.status !== "available") continue;

      const pilotEntry = {
        clientId: target.clientId,
        fullName: target.name,
        avatarUrl: resolveClientAvatarUrl(profile.avatarUrl),
        categoryName: slot.categoryName,
        levelName: slot.levelName,
      };

      const existing = slotMap.get(slot.slotId);
      if (existing) {
        if (!existing.eligiblePilots.some((p) => p.clientId === target.clientId)) {
          existing.eligiblePilots.push(pilotEntry);
        }
        continue;
      }

      slotMap.set(slot.slotId, {
        slotId: slot.slotId,
        time: slot.time,
        end: slot.end,
        durationMinutes: slot.durationMinutes,
        durationLabel: slot.durationLabel,
        status: "available",
        title: slot.title,
        detail: slot.detail,
        categoryName: slot.categoryName,
        levelName: slot.levelName,
        eligiblePilots: [pilotEntry],
      });
    }
  }

  const slots = Array.from(slotMap.values()).sort((a, b) =>
    a.time.localeCompare(b.time),
  );

  return {
    date: isoDate,
    dateLabel: formatDateLabel(isoDate),
    slots,
  };
}
