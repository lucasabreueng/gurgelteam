import {
  SCHEDULE_EVENTS,
  type PaymentStatus,
  type ScheduleEvent,
  type ScheduleEventStatus,
  type ScheduleEventType,
} from "./admin-schedule-mocks";

const addedEvents: ScheduleEvent[] = [];
const patches = new Map<string, Partial<ScheduleEvent>>();
let nextEventSeq = 1;

export function getMergedScheduleEvents(): ScheduleEvent[] {
  return [...SCHEDULE_EVENTS, ...addedEvents].map((event) => {
    const patch = patches.get(event.id);
    return patch ? { ...event, ...patch } : event;
  });
}

export function getScheduleEventById(id: string): ScheduleEvent | undefined {
  return getMergedScheduleEvents().find((e) => e.id === id);
}

export function patchScheduleEvent(id: string, patch: Partial<ScheduleEvent>): void {
  if (!getScheduleEventById(id)) return;
  patches.set(id, { ...(patches.get(id) ?? {}), ...patch });
}

export function confirmScheduleEvent(id: string): void {
  patchScheduleEvent(id, { status: "confirmado" });
}

export type CreateScheduleEventInput = {
  studentName: string;
  studentId?: string;
  date: string;
  start: string;
  end: string;
  categoryId: string;
  kartNumber: number;
  kartId: string;
  type?: ScheduleEventType;
  payment?: PaymentStatus;
  plan?: string;
  lessonsLeft?: number;
  initialStatus?: ScheduleEventStatus;
};

export function createScheduleEvent(input: CreateScheduleEventInput): ScheduleEvent {
  const event: ScheduleEvent = {
    id: `e-new-${nextEventSeq++}`,
    date: input.date,
    start: input.start,
    end: input.end,
    student: input.studentName,
    type: input.type ?? "aula_individual",
    typeLabel: "Aula individual",
    kartNumber: input.kartNumber,
    kartId: input.kartId,
    status: input.initialStatus ?? "confirmado",
    payment: input.payment ?? "pendente",
    category: input.categoryId,
    plan: input.plan,
    lessonsLeft: input.lessonsLeft,
  };
  addedEvents.push(event);
  return event;
}
