import { NextRequest } from "next/server";

import { updateKartStatusSchema } from "@/lib/contracts/api/v1/karts.api.schemas";
import {
  isApiError,
  kartsRepository,
} from "@/lib/server/karts/karts-repository";
import {
  isNextResponse,
  parseJsonBody,
  requireModulePermission,
} from "@/lib/server/api/require-auth";
import {
  internalError,
  jsonError,
  jsonSuccess,
} from "@/lib/server/api/responses";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ kartId: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireModulePermission(request, "karts", "edit");
  if (isNextResponse(auth)) return auth;

  const { kartId } = await params;
  const body = await parseJsonBody(request, updateKartStatusSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await kartsRepository.updateStatus(kartId, body);
    return jsonSuccess(data);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[karts/:id/status PATCH]", error);
    return jsonError(internalError());
  }
}
