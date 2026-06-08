import type { KartOwnershipMode } from "@/lib/contracts/schedule";
import type {
  BuildGurgelTimelineOptions,
  GurgelTimelineSlot,
} from "@/lib/schedule/gurgel-timeline";
import type {
  NewClassFormCatalog,
  NewClassRentalKart,
  NewClassThirdPartyKart,
} from "@/lib/schedule/new-class-catalog";
import {
  loadNewClassFormCatalogHttp,
  loadNewClassFormCatalogMock,
} from "@/lib/schedule/new-class-catalog";
import type { NewClassStudentOption } from "@/lib/admin-new-class-mocks";
import { getDataSourceMode } from "@/lib/data-source/mode";
import {
  buildGurgelTimelineWithEvents,
  findDefaultGurgelSlot,
  findGurgelTimelineSlot,
} from "@/lib/schedule/gurgel-timeline";
import { isUuid } from "@/lib/schedule/resolve-schedule-ids";
import { resolveCategoryId } from "@/lib/reference-data/resolve-reference-ids";
import { timeRangeToIso } from "@/lib/schedule/slot-datetime";
import { getEffectiveScheduleSlotsForDate } from "@/lib/schedule/effective-schedule-slots";
import { ScheduleBlocksRepositoryHttp } from "@/repositories/schedule/ScheduleBlocksRepositoryHttp";
import { NewClassRepositoryMock } from "@/repositories/schedule/NewClassRepositoryMock";
import { ScheduleRepositoryHttp } from "@/repositories/schedule/ScheduleRepositoryHttp";
import {
  OperationalServiceMock,
  type ScheduleNewClassInput,
} from "@/services/operational/operationalServiceMock";

export type {
  NewClassFormCatalog,
  NewClassRentalKart,
  NewClassThirdPartyKart,
};

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

function resolveKartForNewClass(
  student: NewClassStudentOption,
  kartId: string,
  kartMode: KartOwnershipMode,
  rentalKarts: NewClassRentalKart[],
  thirdPartyKarts: NewClassThirdPartyKart[],
): { kartNumber: number; kartId: string } | null {
  if (kartMode === "own") {
    if (!student.hasOwnKart || !student.ownKartNumber) return null;
    return {
      kartNumber: student.ownKartNumber,
      kartId: student.ownKartId ?? kartId,
    };
  }

  if (kartMode === "third_party") {
    const third = thirdPartyKarts.find((k) => k.id === kartId);
    if (!third) return null;
    return { kartNumber: third.number, kartId: third.id };
  }

  const rental = rentalKarts.find((k) => k.id === kartId);
  if (!rental) return null;
  return { kartNumber: rental.number, kartId: rental.id };
}

function filterTimelineEvents(
  events: Awaited<ReturnType<typeof ScheduleRepositoryHttp.fetchEvents>>,
  date: string,
) {
  return events.filter(
    (e) =>
      e.date === date &&
      e.type !== "bloqueio_pista" &&
      e.type !== "manutencao" &&
      e.status !== "cancelado",
  );
}

export function createNewClassService() {
  const mock = {
    getOperational: () => NewClassRepositoryMock.getOperational(),
    getStudents: () => NewClassRepositoryMock.getStudents(),
    getAlerts: () => NewClassRepositoryMock.getAlerts(),
    getSmartSuggestion: () => NewClassRepositoryMock.getSmartSuggestion(),
    getDefaultDate: () => NewClassRepositoryMock.getDefaultDate(),
    getDefaultTime: () => NewClassRepositoryMock.getDefaultTime(),
    getGurgelEventsForDate: NewClassRepositoryMock.getGurgelEventsForDate,
    getAlertsForSelection: NewClassRepositoryMock.getAlertsForSelection,
    formatClassDateTime: NewClassRepositoryMock.formatClassDateTime,
    getKarts: () => NewClassRepositoryMock.getKarts(),
    getThirdPartyKarts: () => NewClassRepositoryMock.getThirdPartyKarts(),
    getRentalKarts: () => NewClassRepositoryMock.getRentalKarts(),
    getCategoryLabel: NewClassRepositoryMock.getCategoryLabel,
    getLevelLabel: NewClassRepositoryMock.getLevelLabel,
    getDefaultClassDate: () => NewClassRepositoryMock.getDefaultDate(),
    getDefaultClassTime: () => NewClassRepositoryMock.getDefaultTime(),
  };

  return {
    ...mock,

    loadFormCatalog(): Promise<NewClassFormCatalog> {
      return isHttpMode()
        ? loadNewClassFormCatalogHttp()
        : Promise.resolve(loadNewClassFormCatalogMock());
    },

    async buildGurgelTimeline(
      date: string,
      options: BuildGurgelTimelineOptions = {},
    ): Promise<GurgelTimelineSlot[]> {
      if (!isHttpMode()) {
        return NewClassRepositoryMock.buildGurgelTimeline(date, options);
      }

      const [events, blockedSlotIds, scheduleSlots] = await Promise.all([
        ScheduleRepositoryHttp.fetchEvents(),
        ScheduleBlocksRepositoryHttp.getBlockedSlotIdsForDate(date),
        getEffectiveScheduleSlotsForDate(date),
      ]);

      return buildGurgelTimelineWithEvents(
        date,
        options,
        filterTimelineEvents(events, date),
        blockedSlotIds,
        scheduleSlots,
      );
    },

    async getDefaultSlotForDate(
      date: string,
      options: BuildGurgelTimelineOptions = {},
    ): Promise<GurgelTimelineSlot | undefined> {
      const slots = await this.buildGurgelTimeline(date, options);
      return findDefaultGurgelSlot(slots);
    },

    async getSlotStatusForTime(
      date: string,
      time: string,
      options: BuildGurgelTimelineOptions = {},
    ): Promise<GurgelTimelineSlot | undefined> {
      const slots = await this.buildGurgelTimeline(date, options);
      return findGurgelTimelineSlot(slots, time);
    },

    async scheduleNewClass(
      input: ScheduleNewClassInput,
    ): Promise<{ eventId: string; message: string }> {
      if (!isHttpMode()) {
        return OperationalServiceMock.scheduleNewClass(input);
      }

      const catalog = await this.loadFormCatalog();
      const student = catalog.students.find((s) => s.id === input.studentId);
      if (!student) {
        throw new Error("Selecione um aluno válido.");
      }

      const kart = resolveKartForNewClass(
        student,
        input.kartId,
        input.kartMode,
        catalog.rentalKarts,
        catalog.thirdPartyKarts,
      );
      if (!kart) {
        throw new Error("Selecione um kart válido.");
      }

      if (!isUuid(student.id)) {
        throw new Error("Aluno não encontrado no cadastro.");
      }

      if (!isUuid(kart.kartId)) {
        throw new Error(`Kart ${kart.kartNumber} não encontrado na frota.`);
      }

      const { startsAt, endsAt } = timeRangeToIso(
        input.date,
        input.start,
        input.end,
      );

      const created = await ScheduleRepositoryHttp.createEvent({
        startsAt,
        endsAt,
        type: "aula_individual",
        clientId: student.id,
        kartId: kart.kartId,
        categoryId: resolveCategoryId(input.categoryId),
      });

      const dateLabel = NewClassRepositoryMock.formatClassDateTime(
        input.date,
        input.start,
      ).split(",")[0];

      return {
        eventId: created.id,
        message: `Aula agendada — ${student.name}, ${dateLabel} ${input.start}–${input.end}, Kart ${kart.kartNumber}.`,
      };
    },
  };
}

export type NewClassService = ReturnType<typeof createNewClassService>;
