import { format } from "date-fns";

import { ptBR } from "date-fns/locale";



import { resolveClientAvatarUrl } from "@/lib/client-avatar";
import type { PilotBookingSlotsApiDTO } from "@/lib/contracts/api/v1/pilot.api.schemas";

import { mapScheduleEventDtoToLegacy } from "@/lib/api/mappers/v1-mappers";

import {

  toCategoryUiId,

  toSkillLevelUiId,

} from "@/lib/reference-data/resolve-reference-ids";

import { buildGurgelTimelineWithEvents } from "@/lib/schedule/gurgel-timeline";

import { pilotRepository } from "@/lib/server/pilot/pilot-repository";

import { loadPilotBookingDayContext } from "@/lib/server/pilot/load-pilot-booking-day-context";



function formatDateLabel(isoDate: string): string {

  const date = new Date(`${isoDate}T12:00:00`);

  if (Number.isNaN(date.getTime())) return isoDate;

  const label = format(date, "EEEE, d 'de' MMMM", { locale: ptBR });

  return label.charAt(0).toUpperCase() + label.slice(1);

}



export async function buildPilotBookingSlots(

  clientId: string,

  isoDate: string,

): Promise<PilotBookingSlotsApiDTO | null> {

  const profile = await pilotRepository.getProfile(clientId);

  if (!profile) return null;



  const dayContext = await loadPilotBookingDayContext(isoDate);



  const legacyEvents = dayContext.eventsResult

    .filter(

      (dto) =>

        dto.type !== "bloqueio_pista" &&

        dto.type !== "manutencao" &&

        dto.status !== "cancelado",

    )

    .map(mapScheduleEventDtoToLegacy);



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



  return {

    date: isoDate,

    dateLabel: formatDateLabel(isoDate),

    slots: timelineSlots.map((slot) => ({

      slotId: slot.slotId,

      time: slot.time,

      end: slot.end,

      durationMinutes: slot.durationMinutes,

      durationLabel: slot.durationLabel,

      status: slot.status,

      title: slot.title,

      detail: slot.detail,

      categoryName: slot.categoryName,

      levelName: slot.levelName,

      eligiblePilots:

        slot.status === "available"

          ? [

              {

                clientId,

                fullName: profile.name,

                avatarUrl: resolveClientAvatarUrl(profile.avatarUrl),

                categoryName: slot.categoryName,

                levelName: slot.levelName,

              },

            ]

          : [],

    })),

  };

}

