import { NextRequest } from "next/server";

import { updateTeamMemberSchema } from "@/lib/contracts/api/v1/team.api.schemas";
import {
  isTeamApiError,
  teamRepository,
} from "@/lib/server/team/team-repository";
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

type Params = { params: Promise<{ userId: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireModulePermission(request, "equipe", "edit");
  if (isNextResponse(auth)) return auth;

  const { userId } = await params;
  const body = await parseJsonBody(request, updateTeamMemberSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await teamRepository.update(userId, body);
    return jsonSuccess(data);
  } catch (error) {
    if (isTeamApiError(error)) return jsonError(error);
    console.error("[team/:id PATCH]", error);
    return jsonError(internalError());
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const auth = await requireModulePermission(_request, "equipe", "delete");
  if (isNextResponse(auth)) return auth;

  const { userId } = await params;

  try {
    await teamRepository.remove(userId);
    return jsonSuccess({ removed: true });
  } catch (error) {
    if (isTeamApiError(error)) return jsonError(error);
    console.error("[team/:id DELETE]", error);
    return jsonError(internalError());
  }
}
