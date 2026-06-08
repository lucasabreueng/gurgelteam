import { NextRequest } from "next/server";

import { replaceIntegrationsSchema } from "@/lib/contracts/api/v1/settings.api.schemas";
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
    const data = await settingsContentRepository.getIntegrations();
    return jsonSuccess(data);
  } catch (error) {
    console.error("[settings/integrations GET]", error);
    return jsonError(internalError());
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireModulePermission(request, "configuracoes", "edit");
  if (isNextResponse(auth)) return auth;

  const body = await parseJsonBody(request, replaceIntegrationsSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await settingsContentRepository.replaceIntegrations(
      body.integrations,
    );
    return jsonSuccess(data);
  } catch (error) {
    console.error("[settings/integrations PUT]", error);
    return jsonError(internalError());
  }
}
