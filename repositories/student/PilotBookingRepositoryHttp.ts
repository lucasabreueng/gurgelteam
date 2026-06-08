import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import type {
  PilotBookingConfirmRequest,
  PilotBookingConfirmResponse,
  PilotBookingSlotsApiDTO,
} from "@/lib/contracts/api/v1/pilot.api.schemas";

export const PilotBookingRepositoryHttp = {
  async getSlotsForDate(date: string): Promise<PilotBookingSlotsApiDTO> {
    const res = await apiFetch<PilotBookingSlotsApiDTO>(
      v1ApiPaths.pilot.bookingSlots(date),
    );
    return unwrapApiResponse(res);
  },

  async confirmBooking(
    input: PilotBookingConfirmRequest,
  ): Promise<PilotBookingConfirmResponse> {
    const res = await apiFetch<PilotBookingConfirmResponse>(
      v1ApiPaths.pilot.booking,
      {
        method: "POST",
        body: JSON.stringify(input),
      },
    );
    return unwrapApiResponse(res);
  },
};
