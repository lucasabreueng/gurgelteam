import { NextRequest } from "next/server";

import { createStockMovementSchema } from "@/lib/contracts/api/v1/inventory.api.schemas";
import { inventoryRepository } from "@/lib/server/inventory/inventory-repository";
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
  const auth = await requireModulePermission(request, "estoque", "view");
  if (isNextResponse(auth)) return auth;

  try {
    const limit = Number(request.nextUrl.searchParams.get("limit") ?? "50");
    const data = await inventoryRepository.listMovements(
      Number.isFinite(limit) ? limit : 50,
    );
    return jsonSuccess(data);
  } catch (error) {
    console.error("[inventory/movements GET]", error);
    return jsonError(internalError());
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireModulePermission(request, "estoque", "edit");
  if (isNextResponse(auth)) return auth;

  const body = await parseJsonBody(request, createStockMovementSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await inventoryRepository.createMovement(body);
    return jsonSuccess(data, 201);
  } catch (error) {
    console.error("[inventory/movements POST]", error);
    return jsonError(internalError());
  }
}
