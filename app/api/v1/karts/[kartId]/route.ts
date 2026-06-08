import { NextRequest } from "next/server";

import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import { updateKartSchema } from "@/lib/contracts/api/v1/karts.api.schemas";
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

export async function GET(request: NextRequest, { params }: Params) {
  const auth = await requireModulePermission(request, "karts", "view");
  if (isNextResponse(auth)) return auth;

  const { kartId } = await params;

  try {
    const data = await kartsRepository.getById(kartId);
    if (!data) {
      return jsonError({
        code: API_ERROR_CODES.NOT_FOUND,
        message: "Kart não encontrado.",
        httpStatus: 404,
      });
    }
    return jsonSuccess(data);
  } catch (error) {
    console.error("[karts/:id GET]", error);
    return jsonError(internalError());
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const auth = await requireModulePermission(request, "karts", "edit");
  if (isNextResponse(auth)) return auth;

  const { kartId } = await params;
  const body = await parseJsonBody(request, updateKartSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await kartsRepository.update(kartId, body);
    return jsonSuccess(data);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[karts/:id PUT]", error);
    return jsonError(internalError());
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await requireModulePermission(request, "karts", "edit");
  if (isNextResponse(auth)) return auth;

  const { kartId } = await params;

  try {
    await kartsRepository.remove(kartId);
    return jsonSuccess({ ok: true });
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[karts/:id DELETE]", error);
    return jsonError(internalError());
  }
}
