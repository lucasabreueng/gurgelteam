import { NextRequest } from "next/server";

import { updateUserPermissionsSchema } from "@/lib/contracts/api/v1/settings.api.schemas";
import { settingsUsersRepository } from "@/lib/server/settings/settings-users-repository";
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

type RouteContext = { params: Promise<{ userId: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  const auth = await requireModulePermission(request, "configuracoes", "edit");
  if (isNextResponse(auth)) return auth;

  const { userId } = await context.params;
  const body = await parseJsonBody(request, updateUserPermissionsSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await settingsUsersRepository.updateUserPermissions(
      userId,
      body,
    );
    return jsonSuccess(data);
  } catch (error) {
    console.error("[settings/users/:id/permissions PUT]", error);
    return jsonError(internalError());
  }
}
