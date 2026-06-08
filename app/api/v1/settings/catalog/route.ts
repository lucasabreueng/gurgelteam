import { NextRequest } from "next/server";

import { replaceSettingsCatalogSchema } from "@/lib/contracts/api/v1/settings.api.schemas";
import { settingsCatalogRepository } from "@/lib/server/settings/settings-catalog-repository";
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
    const data = await settingsCatalogRepository.getCatalog();
    return jsonSuccess(data);
  } catch (error) {
    console.error("[settings/catalog GET]", error);
    return jsonError(internalError());
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireModulePermission(request, "configuracoes", "edit");
  if (isNextResponse(auth)) return auth;

  const body = await parseJsonBody(request, replaceSettingsCatalogSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await settingsCatalogRepository.replaceCatalog(body);
    return jsonSuccess(data);
  } catch (error) {
    console.error("[settings/catalog PUT]", error);
    return jsonError(internalError());
  }
}
