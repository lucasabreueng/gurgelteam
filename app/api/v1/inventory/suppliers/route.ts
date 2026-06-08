import { NextRequest } from "next/server";

import { createSupplierSchema } from "@/lib/contracts/api/v1/inventory.api.schemas";
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
    const data = await inventoryRepository.listSuppliers();
    return jsonSuccess(data);
  } catch (error) {
    console.error("[inventory/suppliers GET]", error);
    return jsonError(internalError());
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireModulePermission(request, "estoque", "edit");
  if (isNextResponse(auth)) return auth;

  const body = await parseJsonBody(request, createSupplierSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await inventoryRepository.createSupplier(body);
    return jsonSuccess(data, 201);
  } catch (error) {
    if (isInventoryApiError(error)) return jsonError(error);
    console.error("[inventory/suppliers POST]", error);
    return jsonError(internalError());
  }
}
