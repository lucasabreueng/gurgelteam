import { NextRequest } from "next/server";

import { updateOrganizationSettingsSchema } from "@/lib/contracts/api/v1/settings.api.schemas";
import { settingsRepository } from "@/lib/server/settings/settings-repository";
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

export async function GET(request: NextRequest) {
  const auth = await requireModulePermission(request, "configuracoes", "view");
  if (isNextResponse(auth)) return auth;

  try {
    const data = await settingsRepository.getOrganization();
    return jsonSuccess(data);
  } catch (error) {
    console.error("[settings/organization GET]", error);
    return jsonError(internalError());
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireModulePermission(request, "configuracoes", "edit");
  if (isNextResponse(auth)) return auth;

  const body = await parseJsonBody(request, updateOrganizationSettingsSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await settingsRepository.updateOrganization(body);
    return jsonSuccess(data);
  } catch (error) {
    console.error("[settings/organization PUT]", error);
    return jsonError(internalError());
  }
}
