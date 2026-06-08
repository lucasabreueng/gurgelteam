import { NextRequest } from "next/server";

import { updateMaintenanceOrderSchema } from "@/lib/contracts/api/v1/maintenance.api.schemas";
import {
  isApiError,
  maintenanceRepository,
} from "@/lib/server/maintenance/maintenance-repository";
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

type RouteContext = { params: Promise<{ orderId: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const auth = await requireModulePermission(_request, "manutencao", "view");
  if (isNextResponse(auth)) return auth;

  const { orderId } = await context.params;

  try {
    const data = await maintenanceRepository.getOrderById(orderId);
    if (!data) {
      return jsonError({
        code: API_ERROR_CODES.NOT_FOUND,
        message: "Ordem de manutenção não encontrada.",
        httpStatus: 404,
      });
    }
    return jsonSuccess(data);
  } catch (error) {
    console.error("[maintenance/orders/:id GET]", error);
    return jsonError(internalError());
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = await requireModulePermission(request, "manutencao", "edit");
  if (isNextResponse(auth)) return auth;

  const { orderId } = await context.params;
  const body = await parseJsonBody(request, updateMaintenanceOrderSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await maintenanceRepository.updateOrder(orderId, body);
    return jsonSuccess(data);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[maintenance/orders/:id PATCH]", error);
    return jsonError(internalError());
  }
}
