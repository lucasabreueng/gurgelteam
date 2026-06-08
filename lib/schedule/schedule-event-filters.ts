import type { ScheduleEventStatus } from "@/lib/contracts/enums";
import type { ScheduleEvent } from "@/lib/contracts/schedule";

/** Statuses excluded from cards, KPIs and timeline operacional da agenda. */
export const AGENDA_NON_OPERATIONAL_STATUSES = [
  "cancelado",
  "reagendado",
  "finalizado",
] as const satisfies readonly ScheduleEventStatus[];

export function isAgendaOperationalEventStatus(
  status: ScheduleEventStatus | string,
): boolean {
  return !AGENDA_NON_OPERATIONAL_STATUSES.includes(
    status as (typeof AGENDA_NON_OPERATIONAL_STATUSES)[number],
  );
}

export function filterAgendaOperationalEvents(
  events: ScheduleEvent[],
): ScheduleEvent[] {
  return events.filter((event) => isAgendaOperationalEventStatus(event.status));
}
