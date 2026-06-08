import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { mapScheduleBlockDtoToEntry } from "@/lib/api/mappers/v1-mappers";
import { scheduleApiPaths } from "@/lib/api/schedule-api-paths";
import type { ScheduleBlockDTO } from "@/lib/contracts/api/v1/schedule.api.schemas";
import type { ScheduleBlockEntry } from "@/repositories/schedule/ScheduleBlocksRepositoryMock";

export const ScheduleBlocksRepositoryHttp = {
  async listBlocks(from?: string, to?: string): Promise<ScheduleBlockEntry[]> {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const qs = params.toString();
    const path = qs
      ? `${scheduleApiPaths.blocks}?${qs}`
      : scheduleApiPaths.blocks;

    const res = await apiFetch<ScheduleBlockDTO[]>(path);
    const data = unwrapApiResponse(res);
    return data.map(mapScheduleBlockDtoToEntry);
  },

  async getBlocksForDate(date: string): Promise<ScheduleBlockEntry[]> {
    return ScheduleBlocksRepositoryHttp.listBlocks(date, date);
  },

  async getBlockedSlotIdsForDate(date: string): Promise<Set<string>> {
    const blocks = await ScheduleBlocksRepositoryHttp.getBlocksForDate(date);
    const ids = new Set<string>();
    for (const block of blocks) {
      for (const id of block.slotIds) ids.add(id);
    }
    return ids;
  },

  async saveScheduleBlock(input: {
    date: string;
    slotIds: string[];
    fullDay: boolean;
    reason: string;
  }): Promise<ScheduleBlockEntry> {
    const res = await apiFetch<ScheduleBlockDTO>(scheduleApiPaths.blocks, {
      method: "POST",
      body: JSON.stringify({
        blockDate: input.date,
        slotIds: input.slotIds,
        fullDay: input.fullDay,
        reason: input.reason.trim() || undefined,
      }),
    });
    const data = unwrapApiResponse(res);
    return mapScheduleBlockDtoToEntry(data);
  },

  async removeScheduleBlock(blockId: string): Promise<void> {
    const res = await apiFetch<{ ok: boolean }>(
      scheduleApiPaths.blockById(blockId),
      {
        method: "DELETE",
      },
    );
    unwrapApiResponse(res);
  },
};
