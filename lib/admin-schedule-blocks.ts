import {
  getWeekDayKeyFromDate,
  SPECIFIC_DATE_SCHEDULES,
  type ScheduleTimeSlot,
  WEEK_SCHEDULE,
} from "./admin-settings-mocks";

export type ScheduleBlockEntry = {
  id: string;
  date: string;
  slotIds: string[];
  fullDay: boolean;
  reason: string;
  createdAt: string;
};

const blocks: ScheduleBlockEntry[] = [];

export function getAllScheduleSlotsForDate(isoDate: string): ScheduleTimeSlot[] {
  const specific = SPECIFIC_DATE_SCHEDULES.find((s) => s.date === isoDate);
  const raw = specific
    ? [...specific.slots]
    : (() => {
        const dayKey = getWeekDayKeyFromDate(isoDate);
        if (!dayKey) return [];
        return [...(WEEK_SCHEDULE.find((d) => d.dayKey === dayKey)?.slots ?? [])];
      })();

  return raw.sort((a, b) => a.start.localeCompare(b.start));
}

export function listScheduleBlocks(): ScheduleBlockEntry[] {
  return [...blocks].sort(
    (a, b) =>
      b.date.localeCompare(a.date) ||
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getBlocksForDate(date: string): ScheduleBlockEntry[] {
  return blocks.filter((b) => b.date === date);
}

export function getBlockedSlotIdsForDate(date: string): Set<string> {
  const ids = new Set<string>();
  for (const block of blocks) {
    if (block.date !== date) continue;
    for (const id of block.slotIds) ids.add(id);
  }
  return ids;
}

export function isDateFullyBlocked(date: string): boolean {
  const slots = getAllScheduleSlotsForDate(date);
  if (slots.length === 0) return false;
  const blocked = getBlockedSlotIdsForDate(date);
  return slots.every((s) => blocked.has(s.id));
}

export function saveScheduleBlock(input: {
  date: string;
  slotIds: string[];
  fullDay: boolean;
  reason: string;
}): ScheduleBlockEntry {
  const existing = blocks.find(
    (b) => b.date === input.date && b.fullDay === input.fullDay,
  );

  if (existing && input.fullDay) {
    existing.slotIds = [...input.slotIds];
    existing.reason = input.reason;
    return existing;
  }

  const entry: ScheduleBlockEntry = {
    id: `blk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    date: input.date,
    slotIds: [...input.slotIds],
    fullDay: input.fullDay,
    reason: input.reason.trim(),
    createdAt: new Date().toISOString(),
  };

  if (input.fullDay) {
    const idx = blocks.findIndex((b) => b.date === input.date && b.fullDay);
    if (idx >= 0) blocks[idx] = entry;
    else blocks.push(entry);
  } else {
    blocks.push(entry);
  }

  return entry;
}

export function removeScheduleBlock(id: string): void {
  const idx = blocks.findIndex((b) => b.id === id);
  if (idx >= 0) blocks.splice(idx, 1);
}

export function clearBlocksForDate(date: string): void {
  for (let i = blocks.length - 1; i >= 0; i--) {
    if (blocks[i].date === date) blocks.splice(i, 1);
  }
}
