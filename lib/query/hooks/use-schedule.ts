"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

const schedule = () => getAppServices().schedule;

export function useScheduleEvents() {
  return useQuery({
    queryKey: queryKeys.schedule.events(),
    queryFn: () => schedule().getEvents(),
  });
}

export function useScheduleUpcomingDays() {
  return useQuery({
    queryKey: queryKeys.schedule.upcomingDays(),
    queryFn: () => schedule().getUpcomingDays(),
  });
}

export function useScheduleMeta() {
  return useQuery({
    queryKey: queryKeys.schedule.meta(),
    queryFn: () => schedule().getMeta(),
    staleTime: 60_000,
  });
}

export function useScheduleEventDetail(eventId: string | null) {
  return useQuery({
    queryKey: queryKeys.schedule.eventDetail(eventId ?? ""),
    queryFn: () =>
      eventId ? schedule().getEventDetail(eventId) : undefined,
    enabled: Boolean(eventId),
  });
}

export function useScheduleDefaultDate() {
  return useQuery({
    queryKey: queryKeys.schedule.defaultDate(),
    queryFn: () => schedule().getDefaultDate(),
    staleTime: 60_000,
  });
}
