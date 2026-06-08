import { NextRequest } from "next/server";

import { replaceAppearanceSettingsSchema } from "@/lib/contracts/api/v1/settings.api.schemas";
import { settingsContentRepository } from "@/lib/server/settings/settings-content-repository";
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
    const data = await settingsContentRepository.getAppearance();
    return jsonSuccess(data);
  } catch (error) {
    console.error("[settings/appearance GET]", error);
    return jsonError(internalError());
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireModulePermission(request, "configuracoes", "edit");
  if (isNextResponse(auth)) return auth;

  const body = await parseJsonBody(request, replaceAppearanceSettingsSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await settingsContentRepository.replaceAppearance(body);
    return jsonSuccess(data);
  } catch (error) {
    console.error("[settings/appearance PUT]", error);
    return jsonError(internalError());
  }
}
