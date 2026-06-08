import { NextRequest } from "next/server";
import { z } from "zod";

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
import { zMoneyCents, zUuid } from "@/lib/contracts/api/common.schemas";

export const dynamic = "force-dynamic";

const createPurchaseLineSchema = z.object({
  supplierId: zUuid,
  inventoryPartId: zUuid,
  qty: z.number().int().positive(),
  unitCostCents: zMoneyCents.optional(),
});

export async function GET(request: NextRequest) {
  const auth = await requireModulePermission(request, "estoque", "view");
  if (isNextResponse(auth)) return auth;

  try {
    const data = await inventoryRepository.listPurchaseOrders();
    return jsonSuccess(data);
  } catch (error) {
    console.error("[inventory/purchase-orders GET]", error);
    return jsonError(internalError());
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireModulePermission(request, "estoque", "edit");
  if (isNextResponse(auth)) return auth;

  const body = await parseJsonBody(request, createPurchaseLineSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await inventoryRepository.createPurchaseOrder(body);
    return jsonSuccess(data, 201);
  } catch (error) {
    if (isInventoryApiError(error)) return jsonError(error);
    console.error("[inventory/purchase-orders POST]", error);
    return jsonError(internalError());
  }
}
