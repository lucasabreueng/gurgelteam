import type { ScheduleTimeSlot } from "@/lib/contracts/settings";

/** Localiza slot da grade pelo horário de início (ex.: "08:00"). */
export function findScheduleSlotByStart(
  slots: ScheduleTimeSlot[],
  startTime: string,
): ScheduleTimeSlot | undefined {
  return slots.find((slot) => slot.start === startTime);
}

/** Mapa start → slot para lookup rápido na timeline. */
export function indexScheduleSlotsByStart(
  slots: ScheduleTimeSlot[],
): Map<string, ScheduleTimeSlot> {
  return new Map(slots.map((slot) => [slot.start, slot]));
}

export function collectBlockedSlotIds(
  blocks: { slotIds: string[] }[],
): Set<string> {
  const blocked = new Set<string>();
  for (const block of blocks) {
    for (const id of block.slotIds) blocked.add(id);
  }
  return blocked;
}

export function isScheduleSlotBlocked(
  slot: ScheduleTimeSlot | undefined,
  blockedSlotIds: Set<string>,
  blocks: { fullDay: boolean }[],
): boolean {
  if (blocks.some((block) => block.fullDay)) return true;
  if (!slot) return false;
  return blockedSlotIds.has(slot.id);
}
