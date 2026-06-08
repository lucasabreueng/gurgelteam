import { NextRequest } from "next/server";

import { linkGuardianSchema } from "@/lib/contracts/api/v1/clients.api.schemas";
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

export async function POST(request: NextRequest, { params }: Params) {
  const auth = await requireModulePermission(request, "alunos", "edit");
  if (isNextResponse(auth)) return auth;

  const { clientId } = await params;
  const body = await parseJsonBody(request, linkGuardianSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await clientsRepository.linkGuardian(clientId, body);
    return jsonSuccess(data, 201);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[clients/:id/guardians POST]", error);
    return jsonError(internalError());
  }
}
