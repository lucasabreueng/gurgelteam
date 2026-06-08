import { NextRequest } from "next/server";
import { z } from "zod";

import { maintenanceChecklistRepository } from "@/lib/server/maintenance/maintenance-checklist-repository";
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
import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";

export const dynamic = "force-dynamic";

const saveChecklistSchema = z.object({
  checklistData: z.unknown(),
});

type RouteContext = { params: Promise<{ orderId: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const auth = await requireModulePermission(_request, "manutencao", "view");
  if (isNextResponse(auth)) return auth;

  const { orderId } = await context.params;

  try {
    const data = await maintenanceChecklistRepository.getOrderChecklist(orderId);
    if (!data) {
      return jsonError({
        code: API_ERROR_CODES.NOT_FOUND,
        message: "Ordem não encontrada.",
        httpStatus: 404,
      });
    }
    return jsonSuccess(data);
  } catch (error) {
    console.error("[maintenance/orders/:id/checklist GET]", error);
    return jsonError(internalError());
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const auth = await requireModulePermission(request, "manutencao", "edit");
  if (isNextResponse(auth)) return auth;

  const { orderId } = await context.params;
  const body = await parseJsonBody(request, saveChecklistSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await maintenanceChecklistRepository.saveOrderChecklist(
      orderId,
      body.checklistData,
    );
    return jsonSuccess(data);
  } catch (error) {
    console.error("[maintenance/orders/:id/checklist PUT]", error);
    return jsonError(internalError());
  }
}
