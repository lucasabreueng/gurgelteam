import { getDataSourceMode } from "@/lib/data-source/mode";
import {
  getDayScheduleForDate,
  getEffectiveScheduleSlotsForDate,
} from "@/lib/schedule/effective-schedule-slots";
import { ScheduleBlocksRepositoryHttp } from "@/repositories/schedule/ScheduleBlocksRepositoryHttp";
import { ScheduleBlocksRepositoryMock } from "@/repositories/schedule/ScheduleBlocksRepositoryMock";

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

export function createScheduleBlocksService() {
  return {
    getDayScheduleForDate(isoDate: string) {
      return getDayScheduleForDate(isoDate);
    },

    getAllScheduleSlotsForDate(isoDate: string) {
      return getEffectiveScheduleSlotsForDate(isoDate);
    },

    listScheduleBlocks() {
      return isHttpMode()
        ? ScheduleBlocksRepositoryHttp.listBlocks()
        : Promise.resolve(ScheduleBlocksRepositoryMock.listScheduleBlocks());
    },

    getBlocksForDate(date: string) {
      return isHttpMode()
        ? ScheduleBlocksRepositoryHttp.getBlocksForDate(date)
        : Promise.resolve(ScheduleBlocksRepositoryMock.getBlocksForDate(date));
    },

    getBlockedSlotIdsForDate(date: string) {
      return isHttpMode()
        ? ScheduleBlocksRepositoryHttp.getBlockedSlotIdsForDate(date)
        : Promise.resolve(
            ScheduleBlocksRepositoryMock.getBlockedSlotIdsForDate(date),
          );
    },

    isDateFullyBlocked(date: string) {
      return Promise.all([
        getEffectiveScheduleSlotsForDate(date),
        isHttpMode()
          ? ScheduleBlocksRepositoryHttp.getBlockedSlotIdsForDate(date)
          : Promise.resolve(
              ScheduleBlocksRepositoryMock.getBlockedSlotIdsForDate(date),
            ),
      ]).then(([slots, blocked]) => {
        if (slots.length === 0) return false;
        return slots.every((s) => blocked.has(s.id));
      });
    },

    saveScheduleBlock(input: {
      date: string;
      slotIds: string[];
      fullDay: boolean;
      reason: string;
    }) {
      return isHttpMode()
        ? ScheduleBlocksRepositoryHttp.saveScheduleBlock(input)
        : Promise.resolve(ScheduleBlocksRepositoryMock.saveScheduleBlock(input));
    },

    removeScheduleBlock(id: string) {
      return isHttpMode()
        ? ScheduleBlocksRepositoryHttp.removeScheduleBlock(id)
        : Promise.resolve(ScheduleBlocksRepositoryMock.removeScheduleBlock(id));
    },

    clearBlocksForDate(date: string) {
      if (isHttpMode()) {
        return ScheduleBlocksRepositoryHttp.getBlocksForDate(date).then(
          (blocks) =>
            Promise.all(
              blocks.map((b) =>
                ScheduleBlocksRepositoryHttp.removeScheduleBlock(b.id),
              ),
            ),
        );
      }
      ScheduleBlocksRepositoryMock.clearBlocksForDate(date);
      return Promise.resolve();
    },

    /** Bloqueia um ou mais slots na data (parcial). */
    blockSlotsForDate(
      date: string,
      slotIds: string[],
      reason = "",
    ) {
      if (slotIds.length === 0) {
        return Promise.resolve(null);
      }
      return this.saveScheduleBlock({
        date,
        slotIds,
        fullDay: false,
        reason,
      });
    },

    /** Remove um slot dos bloqueios existentes na data. */
    async unblockSlotForDate(date: string, slotId: string): Promise<void> {
      const blocks = isHttpMode()
        ? await ScheduleBlocksRepositoryHttp.getBlocksForDate(date)
        : ScheduleBlocksRepositoryMock.getBlocksForDate(date);

      const block = blocks.find((entry) => entry.slotIds.includes(slotId));
      if (!block) return;

      if (isHttpMode()) {
        await ScheduleBlocksRepositoryHttp.removeScheduleBlock(block.id);
      } else {
        ScheduleBlocksRepositoryMock.removeScheduleBlock(block.id);
      }

      const remaining = block.slotIds.filter((id) => id !== slotId);
      if (remaining.length === 0) return;

      await this.saveScheduleBlock({
        date,
        slotIds: remaining,
        fullDay: false,
        reason: block.reason,
      });
    },
  };
}

export type ScheduleBlocksService = ReturnType<
  typeof createScheduleBlocksService
>;

export type { ScheduleBlockEntry } from "@/repositories/schedule/ScheduleBlocksRepositoryMock";
