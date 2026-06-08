import { NextRequest } from "next/server";

import { permissionProfileIdParamSchema } from "@/lib/contracts/api/v1/settings.api.schemas";
import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import { listPermissionProfileAssignees } from "@/lib/server/settings/permission-profile-assignees";
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

type Params = { params: Promise<{ profileId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const auth = await requireModulePermission(request, "configuracoes", "view");
  if (isNextResponse(auth)) return auth;

  const { profileId } = await params;
  const parsed = permissionProfileIdParamSchema.safeParse({ profileId });
  if (!parsed.success) {
    return jsonError({
      code: API_ERROR_CODES.VALIDATION_ERROR,
      message: "Perfil inválido.",
      httpStatus: 400,
    });
  }

  try {
    const assignees = await listPermissionProfileAssignees(parsed.data.profileId);
    return jsonSuccess({ profileId: parsed.data.profileId, assignees });
  } catch (error) {
    console.error(
      "[settings/permission-profiles/:profileId/assignees GET]",
      error,
    );
    return jsonError(internalError());
  }
}
