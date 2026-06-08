import { NextRequest } from "next/server";

import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import { buildKartTechnicalTimeline } from "@/lib/server/maintenance/kart-technical-timeline";
import { prisma } from "@/lib/server/prisma";
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
    const kart = await prisma.kart.findUnique({
      where: { id: kartId },
      select: { id: true },
    });
    if (!kart) {
      return jsonError({
        code: API_ERROR_CODES.NOT_FOUND,
        message: "Kart não encontrado.",
        httpStatus: 404,
      });
    }
    const data = await buildKartTechnicalTimeline(kartId);
    return jsonSuccess(data);
  } catch (error) {
    console.error("[karts/:id/technical-timeline GET]", error);
    return jsonError(internalError());
  }
}
