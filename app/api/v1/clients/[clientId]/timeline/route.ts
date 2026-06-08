import { NextRequest } from "next/server";

import {
  clientsRepository,
  isApiError,
} from "@/lib/server/clients/clients-repository";
import {
  isNextResponse,
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
    const data = await clientsRepository.getTimeline(clientId);
    return jsonSuccess(data);
  } catch (error) {
    if (isApiError(error)) return jsonError(error);
    console.error("[clients/:id/timeline GET]", error);
    return jsonError(internalError());
  }
}
