import { NextRequest } from "next/server";

import {
  clientsQuerySchema,
  createClientSchema,
} from "@/lib/contracts/api/v1/clients.api.schemas";
import {
  clientsRepository,
  isApiError,
} from "@/lib/server/clients/clients-repository";
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
  const auth = await requireModulePermission(request, "alunos", "view");
  if (isNextResponse(auth)) return auth;

  const query = parseSearchParams(request, clientsQuerySchema);
  if (isNextResponse(query)) return query;

  try {
    const data = await clientsRepository.list(query);
    return jsonSuccess(data);
  } catch (error) {
    console.error("[clients GET]", error);
    return jsonError(internalError());
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireModulePermission(request, "alunos", "edit");
  if (isNextResponse(auth)) return auth;

  const body = await parseJsonBody(request, createClientSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await clientsRepository.create(body);
    return jsonSuccess(data, 201);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[clients POST]", error);
    return jsonError(internalError());
  }
}
