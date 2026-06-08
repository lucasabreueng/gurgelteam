import { NextRequest } from "next/server";

import { buildClientEvolutionRankings } from "@/lib/server/clients/build-client-rankings";
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

export async function GET(request: NextRequest) {
  const auth = await requireModulePermission(request, "alunos", "view");
  if (isNextResponse(auth)) return auth;

  try {
    const data = await buildClientEvolutionRankings();
    return jsonSuccess(data);
  } catch (error) {
    console.error("[clients/rankings GET]", error);
    return jsonError(internalError());
  }
}
