import { NextRequest } from "next/server";

import {
  createTeamMemberSchema,
  teamQuerySchema,
} from "@/lib/contracts/api/v1/team.api.schemas";
import {
  isTeamApiError,
  teamRepository,
} from "@/lib/server/team/team-repository";
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
  const auth = await requireModulePermission(request, "equipe", "view");
  if (isNextResponse(auth)) return auth;

  const query = parseSearchParams(request, teamQuerySchema);
  if (isNextResponse(query)) return query;

  try {
    const data = await teamRepository.list(query);
    return jsonSuccess(data);
  } catch (error) {
    console.error("[team GET]", error);
    return jsonError(internalError());
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireModulePermission(request, "equipe", "edit");
  if (isNextResponse(auth)) return auth;

  const body = await parseJsonBody(request, createTeamMemberSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await teamRepository.create(body);
    return jsonSuccess(data, 201);
  } catch (error) {
    if (isTeamApiError(error)) return jsonError(error);
    console.error("[team POST]", error);
    return jsonError(internalError());
  }
}
