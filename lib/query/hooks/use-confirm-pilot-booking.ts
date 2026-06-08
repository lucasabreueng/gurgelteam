"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { PilotBookingConfirmRequest } from "@/lib/contracts/api/v1/pilot.api.schemas";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useConfirmPilotBooking(date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PilotBookingConfirmRequest) =>
      getAppServices().pilotBooking.confirmBooking(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.student.bookingSlots(date),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.student.all,
      });
    },
  });
}
