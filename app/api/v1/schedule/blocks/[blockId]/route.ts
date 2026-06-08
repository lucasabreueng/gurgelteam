import { NextRequest } from "next/server";

import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import {
  isNextResponse,
  requireModulePermission,
} from "@/lib/server/api/require-auth";
import {
  internalError,
  jsonError,
  jsonSuccess,
} from "@/lib/server/api/responses";
import { scheduleBlocksRepository } from "@/lib/server/schedule/schedule-meta";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ blockId: string }> };

export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await requireModulePermission(request, "agenda", "edit");
  if (isNextResponse(auth)) return auth;

  const { blockId } = await params;

  try {
    const deleted = await scheduleBlocksRepository.delete(blockId);
    if (!deleted) {
      return jsonError({
        code: API_ERROR_CODES.NOT_FOUND,
        message: "Bloqueio não encontrado.",
        httpStatus: 404,
      });
    }
    return jsonSuccess({ ok: true });
  } catch (error) {
    console.error("[schedule/blocks/:id DELETE]", error);
    return jsonError(internalError());
  }
}
