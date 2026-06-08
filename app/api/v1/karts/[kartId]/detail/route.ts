import { NextRequest } from "next/server";

import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import { kartsRepository } from "@/lib/server/karts/karts-repository";
import {
  isNextResponse,
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
    const data = await kartsRepository.getDetailById(kartId);
    if (!data) {
      return jsonError({
        code: API_ERROR_CODES.NOT_FOUND,
        message: "Kart não encontrado.",
        httpStatus: 404,
      });
    }
    return jsonSuccess(data);
  } catch (error) {
    console.error("[karts/:id/detail GET]", error);
    return jsonError(internalError());
  }
}
