import { NextRequest } from "next/server";

import { createScheduleBlockSchema, scheduleBlocksQuerySchema } from "@/lib/contracts/api/v1/schedule.api.schemas";
import {
  isNextResponse,
  parseJsonBody,
  parseSearchParams,
  requireModulePermission,
} from "@/lib/server/api/require-auth";
import {
  internalError,
  jsonError,
  jsonSuccess,
} from "@/lib/server/api/responses";
import { dbDateToIsoDate } from "@/lib/server/schedule/schedule-hours-utils";
import { scheduleBlocksRepository } from "@/lib/server/schedule/schedule-meta";

export const dynamic = "force-dynamic";

function mapBlock(block: {
  id: string;
  blockDate: Date;
  slotIds: string[];
  reason: string | null;
  fullDay: boolean;
}) {
  return {
    id: block.id,
    blockDate: dbDateToIsoDate(block.blockDate),
    slotIds: block.slotIds,
    reason: block.reason,
    fullDay: block.fullDay,
  };
}

export async function GET(request: NextRequest) {
  const auth = await requireModulePermission(request, "agenda", "view");
  if (isNextResponse(auth)) return auth;

  const query = parseSearchParams(request, scheduleBlocksQuerySchema);
  if (isNextResponse(query)) return query;

  try {
    const blocks = await scheduleBlocksRepository.list(query.from, query.to);
    return jsonSuccess(blocks.map(mapBlock));
  } catch (error) {
    console.error("[schedule/blocks GET]", error);
    return jsonError(internalError());
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireModulePermission(request, "agenda", "edit");
  if (isNextResponse(auth)) return auth;

  const body = await parseJsonBody(request, createScheduleBlockSchema);
  if (isNextResponse(body)) return body;

  try {
    const block = await scheduleBlocksRepository.create(body);
    return jsonSuccess(mapBlock(block), 201);
  } catch (error) {
    console.error("[schedule/blocks POST]", error);
    return jsonError(internalError());
  }
}
