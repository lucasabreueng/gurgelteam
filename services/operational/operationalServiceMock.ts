import type { NewClientFormData } from "@/components/admin/clients/new-client-drawer";
import type { KartOwnershipMode } from "@/lib/contracts/schedule";
import type { ClientListItem } from "@/lib/admin-clients-mocks";
import {
  createClientFromForm,
} from "@/lib/clients-runtime-store";
import {
  confirmScheduleEvent,
  createScheduleEvent,
  getScheduleEventById,
} from "@/lib/schedule-runtime-store";
import {
  getKartBlockReason,
  isKartBlockedForOperation,
} from "@/lib/karts-runtime-store";
import {
  reserveKartForScheduleEvent,
} from "@/lib/operational-side-effects";
import { NewClassServiceMock } from "@/services/schedule/newClassServiceMock";

export type ScheduleNewClassInput = {
  studentId: string;
  categoryId: string;
  kartId: string;
  kartMode: KartOwnershipMode;
  date: string;
  start: string;
  end: string;
};

function resolveKartForNewClass(
  studentId: string,
  kartId: string,
  kartMode: KartOwnershipMode,
): { kartNumber: number; kartId: string } | null {
  const student = NewClassServiceMock.getStudents().find((s) => s.id === studentId);
  if (!student) return null;

  if (kartMode === "own" && student.ownKartNumber) {
    const fleetId = `k${String(student.ownKartNumber).padStart(2, "0")}`;
    return { kartNumber: student.ownKartNumber, kartId: fleetId };
  }

  if (kartMode === "third_party") {
    const third = NewClassServiceMock.getThirdPartyKarts().find((k) => k.id === kartId);
    if (!third) return null;
    return { kartNumber: third.number, kartId: third.id };
  }

  const rental = NewClassServiceMock.getRentalKarts().find((k) => k.id === kartId);
  if (!rental) return null;
  return { kartNumber: rental.number, kartId: rental.id };
}

export const OperationalServiceMock = {
  registerClient(data: NewClientFormData): ClientListItem {
    return createClientFromForm(data);
  },

  confirmLesson(eventId: string): boolean {
    const event = getScheduleEventById(eventId);
    if (!event) return false;
    if (event.status === "confirmado" || event.status === "em_andamento") {
      return false;
    }
    confirmScheduleEvent(eventId);
    return true;
  },

  scheduleNewClass(input: ScheduleNewClassInput): {
    eventId: string;
    message: string;
  } {
    const student = NewClassServiceMock.getStudents().find(
      (s) => s.id === input.studentId,
    );
    if (!student) {
      throw new Error("Selecione um aluno válido.");
    }

    const kart = resolveKartForNewClass(
      input.studentId,
      input.kartId,
      input.kartMode,
    );
    if (!kart) {
      throw new Error("Selecione um kart válido.");
    }

    if (isKartBlockedForOperation(kart.kartNumber)) {
      const reason = getKartBlockReason(kart.kartNumber);
      throw new Error(
        reason
          ? `Kart ${kart.kartNumber} indisponível (${reason}).`
          : `Kart ${kart.kartNumber} indisponível para agendamento.`,
      );
    }

    reserveKartForScheduleEvent(kart.kartNumber);

    const event = createScheduleEvent({
      studentName: student.name,
      date: input.date,
      start: input.start,
      end: input.end,
      categoryId: input.categoryId,
      kartNumber: kart.kartNumber,
      kartId: kart.kartId,
      plan: student.plan,
      lessonsLeft: student.lessonsLeft,
      initialStatus: "confirmado",
    });

    const dateLabel = NewClassServiceMock.formatClassDateTime(
      input.date,
      input.start,
    ).split(",")[0];

    return {
      eventId: event.id,
      message: `Aula agendada — ${student.name}, ${dateLabel} ${input.start}–${input.end}, Kart ${kart.kartNumber}.`,
    };
  },
};
