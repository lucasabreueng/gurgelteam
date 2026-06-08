import { NextRequest } from "next/server";

import { updateClientSchema } from "@/lib/contracts/api/v1/clients.api.schemas";
import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import {
  clientsRepository,
  isApiError,
} from "@/lib/server/clients/clients-repository";
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

type Params = { params: Promise<{ clientId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const auth = await requireModulePermission(request, "alunos", "view");
  if (isNextResponse(auth)) return auth;

  const { clientId } = await params;

  try {
    const data = await clientsRepository.getById(clientId);
    if (!data) {
      return jsonError({
        code: API_ERROR_CODES.NOT_FOUND,
        message: "Cliente não encontrado.",
        httpStatus: 404,
      });
    }
    return jsonSuccess(data);
  } catch (error) {
    console.error("[clients/:id GET]", error);
    return jsonError(internalError());
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireModulePermission(request, "alunos", "edit");
  if (isNextResponse(auth)) return auth;

  const { clientId } = await params;
  const body = await parseJsonBody(request, updateClientSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await clientsRepository.update(clientId, body);
    return jsonSuccess(data);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[clients/:id PATCH]", error);
    return jsonError(internalError());
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const auth = await requireModulePermission(_request, "alunos", "delete");
  if (isNextResponse(auth)) return auth;

  const { clientId } = await params;

  try {
    await clientsRepository.remove(clientId);
    return jsonSuccess({ removed: true });
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[clients/:id DELETE]", error);
    return jsonError(internalError());
  }
}
