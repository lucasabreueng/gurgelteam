import { NextRequest } from "next/server";

import { pilotStatsQuerySchema } from "@/lib/contracts/api/v1/clients.api.schemas";
import {
  clientsRepository,
  isApiError,
} from "@/lib/server/clients/clients-repository";
import {
  isNextResponse,
  parseSearchParams,
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
  const query = parseSearchParams(request, pilotStatsQuerySchema);
  if (isNextResponse(query)) return query;

  try {
    const data = await clientsRepository.getStats(clientId, query);
    return jsonSuccess(data);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[clients/:id/stats GET]", error);
    return jsonError(internalError());
  }
}
