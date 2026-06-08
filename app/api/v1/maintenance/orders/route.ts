import { NextRequest } from "next/server";

import { createMaintenanceOrderSchema } from "@/lib/contracts/api/v1/maintenance.api.schemas";
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

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireModulePermission(request, "manutencao", "view");
  if (isNextResponse(auth)) return auth;

  try {
    const data = await maintenanceRepository.listOrders();
    return jsonSuccess(data);
  } catch (error) {
    console.error("[maintenance/orders GET]", error);
    return jsonError(internalError());
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireModulePermission(request, "manutencao", "edit");
  if (isNextResponse(auth)) return auth;

  const body = await parseJsonBody(request, createMaintenanceOrderSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await maintenanceRepository.createOrder(body);
    return jsonSuccess(data, 201);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[maintenance/orders POST]", error);
    return jsonError(internalError());
  }
}
