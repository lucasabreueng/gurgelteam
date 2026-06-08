import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { mapScheduleEventDtoToLegacy } from "@/lib/api/mappers/v1-mappers";
import { scheduleApiPaths } from "@/lib/api/schedule-api-paths";
import type {
  CreateScheduleEventRequest,
  RescheduleEventRequest,
  ScheduleEventDTO,
  UpdateScheduleEventRequest,
} from "@/lib/contracts/api/v1/schedule.api.schemas";
import type {
  ScheduleMetaDTO,
  ScheduleUpcomingDaysResponseDTO,
} from "@/lib/contracts/schedule/schedule-api.types";
import type { ScheduleEvent } from "@/lib/contracts/schedule";

export const ScheduleRepositoryHttp = {
  async fetchEvents(range?: {
    from?: string;
    to?: string;
  }): Promise<ScheduleEvent[]> {
    const params = new URLSearchParams();
    if (range?.from) params.set("from", range.from);
    if (range?.to) params.set("to", range.to);
    const qs = params.toString();
    const path = qs
      ? `${scheduleApiPaths.events}?${qs}`
      : scheduleApiPaths.events;

    const res = await apiFetch<ScheduleEventDTO[]>(path);
    const data = unwrapApiResponse(res);
    return data.map(mapScheduleEventDtoToLegacy);
  },

  async fetchUpcomingDays(): Promise<ScheduleUpcomingDaysResponseDTO> {
    const res = await apiFetch<ScheduleUpcomingDaysResponseDTO>(
      scheduleApiPaths.upcomingDays,
    );
    return unwrapApiResponse(res);
  },

  async fetchMeta(): Promise<ScheduleMetaDTO> {
    const res = await apiFetch<ScheduleMetaDTO>(scheduleApiPaths.meta);
    return unwrapApiResponse(res);
  },

  async fetchEventById(eventId: string): Promise<ScheduleEvent | undefined> {
    const res = await apiFetch<ScheduleEventDTO | null>(
      scheduleApiPaths.eventById(eventId),
    );
    const data = unwrapApiResponse(res);
    return data ? mapScheduleEventDtoToLegacy(data) : undefined;
  },

  async rescheduleEvent(
    eventId: string,
    body: RescheduleEventRequest,
  ): Promise<ScheduleEvent> {
    const res = await apiFetch<ScheduleEventDTO>(
      scheduleApiPaths.eventReschedule(eventId),
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
    const data = unwrapApiResponse(res);
    return mapScheduleEventDtoToLegacy(data);
  },

  async createEvent(
    body: CreateScheduleEventRequest,
  ): Promise<ScheduleEvent> {
    const res = await apiFetch<ScheduleEventDTO>(scheduleApiPaths.events, {
      method: "POST",
      body: JSON.stringify(body),
    });
    const data = unwrapApiResponse(res);
    return mapScheduleEventDtoToLegacy(data);
  },

  async cancelEvent(
    eventId: string,
    reason?: string,
  ): Promise<ScheduleEvent> {
    const res = await apiFetch<ScheduleEventDTO>(
      scheduleApiPaths.eventCancel(eventId),
      {
        method: "POST",
        body: JSON.stringify(reason ? { reason } : {}),
      },
    );
    const data = unwrapApiResponse(res);
    return mapScheduleEventDtoToLegacy(data);
  },

  async swapKart(
    eventId: string,
    kartId: string,
    reason?: string,
  ): Promise<ScheduleEvent> {
    const res = await apiFetch<ScheduleEventDTO>(
      scheduleApiPaths.eventSwapKart(eventId),
      {
        method: "POST",
        body: JSON.stringify({ kartId, ...(reason ? { reason } : {}) }),
      },
    );
    const data = unwrapApiResponse(res);
    return mapScheduleEventDtoToLegacy(data);
  },

  async updateEvent(
    eventId: string,
    body: UpdateScheduleEventRequest,
  ): Promise<ScheduleEvent> {
    const res = await apiFetch<ScheduleEventDTO>(
      scheduleApiPaths.eventById(eventId),
      {
        method: "PATCH",
        body: JSON.stringify(body),
      },
    );
    const data = unwrapApiResponse(res);
    return mapScheduleEventDtoToLegacy(data);
  },
};
