import { NextRequest } from "next/server";

import { createKartSchema, kartsQuerySchema } from "@/lib/contracts/api/v1/karts.api.schemas";
import {
  isApiError,
  kartsRepository,
} from "@/lib/server/karts/karts-repository";
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

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireModulePermission(request, "karts", "view");
  if (isNextResponse(auth)) return auth;

  const query = parseSearchParams(request, kartsQuerySchema);
  if (isNextResponse(query)) return query;

  try {
    const data = await kartsRepository.list(query);
    return jsonSuccess(data);
  } catch (error) {
    console.error("[karts GET]", error);
    return jsonError(internalError());
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireModulePermission(request, "karts", "edit");
  if (isNextResponse(auth)) return auth;

  const body = await parseJsonBody(request, createKartSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await kartsRepository.create(body);
    return jsonSuccess(data, 201);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    const message =
      error instanceof Error ? error.message : "Erro ao criar kart.";
    if (message.includes("Unknown argument `photoUrl`")) {
      return jsonError({
        code: "INTERNAL_ERROR",
        message:
          "Servidor desatualizado (Prisma). Pare o npm run dev, execute npx prisma generate e reinicie.",
        httpStatus: 500,
      });
    }
    console.error("[karts POST]", error);
    return jsonError({
      ...internalError(),
      message,
    });
  }
}
