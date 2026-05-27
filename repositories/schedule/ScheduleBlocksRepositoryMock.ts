import { SettingsRepositoryMock } from "@/repositories/settings/SettingsRepositoryMock";
import type { ScheduleTimeSlot } from "@/lib/contracts/settings";

export type ScheduleBlockEntry = {
  id: string;
  date: string;
  slotIds: string[];
  fullDay: boolean;
  reason: string;
  createdAt: string;
};

const blocks: ScheduleBlockEntry[] = [];

export const ScheduleBlocksRepositoryMock = {
  getAllScheduleSlotsForDate(isoDate: string): ScheduleTimeSlot[] {
    const specific = SettingsRepositoryMock.getSpecificDateSchedules().find(
      (s) => s.date === isoDate,
    );
    const raw = specific
      ? [...specific.slots]
      : (() => {
          const dayKey = SettingsRepositoryMock.getWeekDayKeyFromDate(isoDate);
          if (!dayKey) return [];
          return [
            ...(SettingsRepositoryMock.getWeekSchedule().find(
              (d) => d.dayKey === dayKey,
            )?.slots ?? []),
          ];
        })();

    return raw.sort((a, b) => a.start.localeCompare(b.start));
  },

  listScheduleBlocks(): ScheduleBlockEntry[] {
    return [...blocks].sort(
      (a, b) =>
        b.date.localeCompare(a.date) ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  getBlocksForDate(date: string): ScheduleBlockEntry[] {
    return blocks.filter((b) => b.date === date);
  },

  getBlockedSlotIdsForDate(date: string): Set<string> {
    const ids = new Set<string>();
    for (const block of blocks) {
      if (block.date !== date) continue;
      for (const id of block.slotIds) ids.add(id);
    }
    return ids;
  },

  isDateFullyBlocked(date: string): boolean {
    const slots = ScheduleBlocksRepositoryMock.getAllScheduleSlotsForDate(date);
    if (slots.length === 0) return false;
    const blocked = ScheduleBlocksRepositoryMock.getBlockedSlotIdsForDate(date);
    return slots.every((s) => blocked.has(s.id));
  },

  saveScheduleBlock(input: {
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
  },

  removeScheduleBlock(id: string): void {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx >= 0) blocks.splice(idx, 1);
  },

  clearBlocksForDate(date: string): void {
    for (let i = blocks.length - 1; i >= 0; i--) {
      if (blocks[i].date === date) blocks.splice(i, 1);
    }
  },
};
