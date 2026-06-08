import { format, startOfDay, startOfToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { User } from "@prisma/client";

import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import type { ApiError } from "@/lib/contracts/api/api-error";
import type { PilotBookingConfirmResponse } from "@/lib/contracts/api/v1/pilot.api.schemas";
import { slotToDateTimeRange } from "@/lib/schedule/slot-datetime";
import { buildPilotBookingSlots } from "@/lib/server/pilot/build-pilot-booking-slots";
import { resolveBookingClientsByIds } from "@/lib/server/pilot/list-guardian-booking-clients";
import { pilotRepository } from "@/lib/server/pilot/pilot-repository";
import { resolveKartForPilotBooking } from "@/lib/server/pilot/resolve-pilot-booking-kart";
import { prisma } from "@/lib/server/prisma";
import { scheduleSlotsRepository } from "@/lib/server/schedule/schedule-slots-repository";

function businessRuleError(message: string): ApiError {
  return {
    code: API_ERROR_CODES.BUSINESS_RULE,
    message,
    httpStatus: 422,
  };
}

function conflictError(message: string): ApiError {
  return {
    code: API_ERROR_CODES.CONFLICT,
    message,
    httpStatus: 409,
  };
}

function notFoundError(message: string): ApiError {
  return {
    code: API_ERROR_CODES.NOT_FOUND,
    message,
    httpStatus: 404,
  };
}

function formatDateLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  const label = format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function assertBookableDate(isoDate: string): void {
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    throw businessRuleError("Data inválida.");
  }
  if (date.getDay() === 1) {
    throw businessRuleError("Segundas-feiras não possuem operação.");
  }
  if (startOfDay(date) < startOfToday()) {
    throw businessRuleError("Não é possível reservar datas passadas.");
  }
}

type BookingPlan = {
  clientId: string;
  clientName: string;
  categoryId: string | null;
  kartId: string;
  kartNumber: number;
};

export async function confirmPilotBooking(
  user: User,
  input: { date: string; slotId: string; clientIds: string[] },
): Promise<PilotBookingConfirmResponse> {
  if (!user.clientId) {
    throw {
      code: API_ERROR_CODES.UNAUTHORIZED,
      message: "Conta sem perfil de piloto vinculado.",
      httpStatus: 401,
    } satisfies ApiError;
  }

  assertBookableDate(input.date);

  const targets = await resolveBookingClientsByIds(user, input.clientIds);

  const daySchedule = await scheduleSlotsRepository.getDayScheduleForDate(
    input.date,
  );
  const scheduleSlot = daySchedule.slots.find((entry) => entry.id === input.slotId);
  if (!scheduleSlot) {
    throw notFoundError("Slot da grade não encontrado.");
  }

  const { startsAt, endsAt } = slotToDateTimeRange(input.date, scheduleSlot);
  const startsAtDate = new Date(startsAt);
  const endsAtDate = new Date(endsAt);

  let slotTime: string | null = null;
  let slotEnd: string | null = null;
  const reservedKartIds = new Set<string>();
  const plans: BookingPlan[] = [];

  for (const target of targets) {
    const profile = await pilotRepository.getProfile(target.clientId);
    if (!profile) {
      throw notFoundError(`Perfil de piloto não encontrado (${target.name}).`);
    }

    const slotsPayload = await buildPilotBookingSlots(target.clientId, input.date);
    if (!slotsPayload) {
      throw notFoundError(`Perfil de piloto não encontrado (${target.name}).`);
    }

    const slot = slotsPayload.slots.find((entry) => entry.slotId === input.slotId);
    if (!slot) {
      throw notFoundError(
        `Horário não encontrado na grade do dia para ${target.name}.`,
      );
    }
    if (slot.status !== "available") {
      throw conflictError(
        `${target.name} não está elegível neste horário (categoria ou nível incompatível).`,
      );
    }

    slotTime ??= slot.time;
    slotEnd ??= slot.end;

    const categoryId = profile.categoryIds[0] ?? null;
    const kart = await resolveKartForPilotBooking(
      target.clientId,
      categoryId,
      startsAtDate,
      endsAtDate,
      profile.favoriteNumber,
      reservedKartIds,
    );
    reservedKartIds.add(kart.kartId);

    plans.push({
      clientId: target.clientId,
      clientName: target.name,
      categoryId,
      kartId: kart.kartId,
      kartNumber: kart.kartNumber,
    });
  }

  if (!slotTime || !slotEnd) {
    throw notFoundError("Horário não encontrado na grade do dia.");
  }

  const createdEvents = await prisma.$transaction(
    plans.map((plan) =>
      prisma.scheduleEvent.create({
        data: {
          startsAt: startsAtDate,
          endsAt: endsAtDate,
          type: "reserva_kart",
          status: "pendente",
          clientId: plan.clientId,
          registeredById: user.id,
          kartId: plan.kartId,
          categoryId: plan.categoryId ?? null,
          notes: "Reserva via portal do piloto",
        },
        select: { id: true },
      }),
    ),
  );

  const dateLabel = formatDateLabel(input.date);
  const bookings = plans.map((plan, index) => ({
    clientId: plan.clientId,
    clientName: plan.clientName,
    eventId: createdEvents[index]!.id,
    kartNumber: plan.kartNumber,
  }));

  const message =
    bookings.length > 1
      ? `Reservas confirmadas para ${bookings.length} pilotos — ${dateLabel}, ${slotTime}–${slotEnd}.`
      : `Reserva confirmada — ${dateLabel}, ${slotTime}–${slotEnd}, Kart ${bookings[0]!.kartNumber}.`;

  return {
    eventId: bookings[0]!.eventId,
    message,
    date: input.date,
    time: slotTime,
    end: slotEnd,
    dateLabel,
    bookings: bookings.length > 1 ? bookings : undefined,
  };
}
