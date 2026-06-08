import { prisma } from "@/lib/server/prisma";
import { scheduleRepository } from "@/lib/server/schedule/schedule-repository";
import { scheduleSlotsRepository } from "@/lib/server/schedule/schedule-slots-repository";
import { isoDateToDbDate } from "@/lib/server/schedule/schedule-hours-utils";

async function getBlockedSlotIdsForDate(isoDate: string): Promise<Set<string>> {
  const blocks = await prisma.scheduleBlock.findMany({
    where: { blockDate: isoDateToDbDate(isoDate) },
  });
  const ids = new Set<string>();
  for (const block of blocks) {
    for (const id of block.slotIds) ids.add(id);
  }
  return ids;
}

export async function loadPilotBookingDayContext(isoDate: string) {
  const [{ slots, configBlockedSlotIds }, blockIds, eventsResult] =
    await Promise.all([
      scheduleSlotsRepository.getDayScheduleForDate(isoDate),
      getBlockedSlotIdsForDate(isoDate),
      scheduleRepository.listEvents({ from: isoDate, to: isoDate }),
    ]);

  const blockedSlotIds = new Set([...blockIds, ...configBlockedSlotIds]);

  return {
    scheduleSlots: slots,
    blockedSlotIds,
    eventsResult,
  };
}
