import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { scheduleApiPaths } from "@/lib/api/schedule-api-paths";
import type {
  ScheduleMetaDTO,
  ScheduleUpcomingDaysResponseDTO,
} from "@/lib/contracts/schedule/schedule-api.types";
import type { ScheduleEvent } from "@/lib/contracts/schedule";

export const ScheduleRepositoryHttp = {
  async fetchEvents(): Promise<ScheduleEvent[]> {
    const res = await apiFetch<ScheduleEvent[]>(scheduleApiPaths.events);
    return unwrapApiResponse(res);
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
    const res = await apiFetch<ScheduleEvent | null>(
      scheduleApiPaths.eventById(eventId),
    );
    const data = unwrapApiResponse(res);
    return data ?? undefined;
  },
};
