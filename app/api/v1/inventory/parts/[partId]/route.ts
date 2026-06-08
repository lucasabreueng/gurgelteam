import { NextRequest } from "next/server";



import { updateInventoryPartSchema } from "@/lib/contracts/api/v1/inventory.api.schemas";

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

import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";



export const dynamic = "force-dynamic";



type RouteContext = { params: Promise<{ partId: string }> };



export async function GET(_request: NextRequest, context: RouteContext) {

  const auth = await requireModulePermission(_request, "estoque", "view");

  if (isNextResponse(auth)) return auth;



  const { partId } = await context.params;



  try {

    const data = await inventoryRepository.getPartById(partId);

    if (!data) {

      return jsonError({

        code: API_ERROR_CODES.NOT_FOUND,

        message: "Peça não encontrada.",

        httpStatus: 404,

      });

    }

    return jsonSuccess(data);

  } catch (error) {

    console.error("[inventory/parts/:id GET]", error);

    return jsonError(internalError());

  }

}



export async function PATCH(request: NextRequest, context: RouteContext) {

  const auth = await requireModulePermission(request, "estoque", "edit");

  if (isNextResponse(auth)) return auth;



  const { partId } = await context.params;

  const body = await parseJsonBody(request, updateInventoryPartSchema);

  if (isNextResponse(body)) return body;



  try {

    const data = await inventoryRepository.updatePart(partId, body);

    return jsonSuccess(data);

  } catch (error) {

    if (isInventoryApiError(error)) return jsonError(error);

    console.error("[inventory/parts/:id PATCH]", error);

    return jsonError(internalError());

  }

}



export async function DELETE(_request: NextRequest, context: RouteContext) {

  const auth = await requireModulePermission(_request, "estoque", "delete");

  if (isNextResponse(auth)) return auth;



  const { partId } = await context.params;



  try {

    await inventoryRepository.deletePart(partId);

    return jsonSuccess({ ok: true });

  } catch (error) {

    if (isInventoryApiError(error)) return jsonError(error);

    console.error("[inventory/parts/:id DELETE]", error);

    return jsonError(internalError());

  }

}

