import { ScheduleKartsRepositoryMock } from "@/repositories/schedule/ScheduleKartsRepositoryMock";

export const ScheduleKartsServiceMock = {
  getKartSwapOptions: ScheduleKartsRepositoryMock.getKartSwapOptions,
  getKartReservationAtSlot: ScheduleKartsRepositoryMock.getKartReservationAtSlot,
};

export type { KartSwapOption } from "@/lib/contracts/schedule/karts";
