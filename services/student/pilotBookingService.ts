import { format } from "date-fns";

import { ptBR } from "date-fns/locale";



import type {

  PilotBookingConfirmRequest,

  PilotBookingConfirmResponse,

  PilotBookingSlotsApiDTO,

} from "@/lib/contracts/api/v1/pilot.api.schemas";

import { resolveClientAvatarUrl } from "@/lib/client-avatar";

import { getDataSourceMode } from "@/lib/data-source/mode";

import { getAppServices } from "@/lib/data-source/app-services";

import { createScheduleEvent } from "@/lib/schedule-runtime-store";

import { NewClassServiceMock } from "@/services/schedule/newClassServiceMock";

import { PilotBookingRepositoryHttp } from "@/repositories/student/PilotBookingRepositoryHttp";



function formatDateLabel(isoDate: string): string {

  const date = new Date(`${isoDate}T12:00:00`);

  if (Number.isNaN(date.getTime())) return isoDate;

  const label = format(date, "EEEE, d 'de' MMMM", { locale: ptBR });

  return label.charAt(0).toUpperCase() + label.slice(1);

}



function isHttpMode(): boolean {

  return getDataSourceMode() === "http";

}



export function createPilotBookingService() {

  return {

    async getSlotsForDate(date: string): Promise<PilotBookingSlotsApiDTO> {

      if (isHttpMode()) {

        return PilotBookingRepositoryHttp.getSlotsForDate(date);

      }



      const students = NewClassServiceMock.getStudents().slice(0, 3);

      const slots = await getAppServices().newClass.buildGurgelTimeline(date);



      const aggregated = new Map<string, PilotBookingSlotsApiDTO["slots"][number]>();



      for (const student of students) {

        for (const slot of slots) {

          if (slot.status !== "available") continue;



          const pilotEntry = {

            clientId: student.id,

            fullName: student.name,

            avatarUrl: resolveClientAvatarUrl(undefined),

            categoryName: slot.categoryName,

            levelName: slot.levelName,

          };



          const existing = aggregated.get(slot.slotId);

          if (existing) {

            if (!existing.eligiblePilots.some((p) => p.clientId === student.id)) {

              existing.eligiblePilots.push(pilotEntry);

            }

            continue;

          }



          aggregated.set(slot.slotId, {

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



      return {

        date,

        dateLabel: formatDateLabel(date),

        slots: Array.from(aggregated.values()).sort((a, b) =>

          a.time.localeCompare(b.time),

        ),

      };

    },



    async confirmBooking(

      input: PilotBookingConfirmRequest,

    ): Promise<PilotBookingConfirmResponse> {

      if (isHttpMode()) {

        return PilotBookingRepositoryHttp.confirmBooking(input);

      }



      const slotsPayload = await this.getSlotsForDate(input.date);

      const slot = slotsPayload.slots.find((entry) => entry.slotId === input.slotId);

      if (!slot) {

        throw new Error("Horário não encontrado na grade do dia.");

      }



      const eligibleIds = new Set(slot.eligiblePilots.map((p) => p.clientId));

      const students = NewClassServiceMock.getStudents().filter((entry) =>

        input.clientIds.includes(entry.id) && eligibleIds.has(entry.id),

      );



      if (students.length === 0) {

        throw new Error("Nenhum piloto elegível selecionado para este horário.");

      }



      const dateLabel = formatDateLabel(input.date);

      const bookings = students.map((student) => {

        const event = createScheduleEvent({

          studentName: student.name,

          studentId: student.id,

          date: input.date,

          start: slot.time,

          end: slot.end,

          categoryId: student.allowedCategoryIds[0] ?? "f400",

          kartNumber: student.ownKartNumber ?? 14,

          kartId: student.ownKartId ?? "k14",

          type: "reserva_kart",

          initialStatus: "pendente",

        });

        return {

          clientId: student.id,

          clientName: student.name,

          eventId: event.id,

          kartNumber: student.ownKartNumber ?? 14,

        };

      });



      const message =

        bookings.length > 1

          ? `Reservas confirmadas para ${bookings.length} pilotos — ${dateLabel}, ${slot.time}–${slot.end}.`

          : `Reserva confirmada — ${dateLabel}, ${slot.time}–${slot.end}, Kart ${bookings[0]!.kartNumber}.`;



      return {

        eventId: bookings[0]!.eventId,

        message,

        date: input.date,

        time: slot.time,

        end: slot.end,

        dateLabel,

        bookings: bookings.length > 1 ? bookings : undefined,

      };

    },

  };

}

