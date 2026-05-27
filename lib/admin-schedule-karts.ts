/** @deprecated Use ScheduleKartsServiceMock */
export type { KartSwapOption } from "@/lib/contracts/schedule/karts";

import { ScheduleKartsRepositoryMock } from "@/repositories/schedule/ScheduleKartsRepositoryMock";

export const getKartSwapOptions = ScheduleKartsRepositoryMock.getKartSwapOptions;
export const getKartReservationAtSlot =
  ScheduleKartsRepositoryMock.getKartReservationAtSlot;
