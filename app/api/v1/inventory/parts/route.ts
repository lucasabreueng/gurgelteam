import { NextRequest } from "next/server";

import {
  createInventoryPartSchema,
} from "@/lib/contracts/api/v1/inventory.api.schemas";
import {
  inventoryRepository,
  isInventoryApiError,
} from "@/lib/server/inventory/inventory-repository";
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
    const data = await inventoryRepository.listParts();
    return jsonSuccess(data);
  } catch (error) {
    console.error("[inventory/parts GET]", error);
    return jsonError(internalError());
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireModulePermission(request, "estoque", "edit");
  if (isNextResponse(auth)) return auth;

  const body = await parseJsonBody(request, createInventoryPartSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await inventoryRepository.createPart(body);
    return jsonSuccess(data, 201);
  } catch (error) {
    if (isInventoryApiError(error)) return jsonError(error);
    console.error("[inventory/parts POST]", error);
    return jsonError(internalError());
  }
}
