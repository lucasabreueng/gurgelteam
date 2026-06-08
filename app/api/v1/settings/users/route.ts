import { NextRequest } from "next/server";

import { replaceSettingsUsersSchema } from "@/lib/contracts/api/v1/settings.api.schemas";
import type { SettingsUserAccount } from "@/lib/contracts/settings";
import type { ModuleKey } from "@/lib/contracts/enums";
import { MODULE_KEYS } from "@/lib/contracts/enums";
import { settingsUsersRepository } from "@/lib/server/settings/settings-users-repository";
import { parseJsonBody } from "@/lib/server/api/require-auth";
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
  const auth = await requireModulePermission(request, "configuracoes", "view");
  if (isNextResponse(auth)) return auth;

  try {
    const data = await settingsUsersRepository.listUsers();
    return jsonSuccess(data);
  } catch (error) {
    console.error("[settings/users GET]", error);
    return jsonError(internalError());
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireModulePermission(request, "configuracoes", "edit");
  if (isNextResponse(auth)) return auth;

  const body = await parseJsonBody(request, replaceSettingsUsersSchema);
  if (isNextResponse(body)) return body;

  try {
    const users: SettingsUserAccount[] = body.users.map((user) => {
      const modules = Object.fromEntries(
        MODULE_KEYS.map((key) => [
          key,
          { visualizar: false, editar: false, excluir: false },
        ]),
      ) as SettingsUserAccount["modules"];

      for (const mod of user.modules) {
        const key = mod.moduleKey as ModuleKey;
        if (!(key in modules)) continue;
        modules[key] = {
          visualizar: mod.canView,
          editar: mod.canEdit,
          excluir: mod.canDelete,
        };
      }

      return { id: user.id, name: user.name, modules };
    });

    const data = await settingsUsersRepository.saveAllPermissionProfiles(users);
    return jsonSuccess(data);
  } catch (error) {
    console.error("[settings/users PUT]", error);
    return jsonError(internalError());
  }
}
