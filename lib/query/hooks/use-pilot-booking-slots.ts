"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function usePilotBookingSlots(date: string | null) {
  return useQuery({
    queryKey: queryKeys.student.bookingSlots(date ?? ""),
    queryFn: () => getAppServices().pilotBooking.getSlotsForDate(date!),
    enabled: Boolean(date),
    staleTime: 30_000,
  });
}
