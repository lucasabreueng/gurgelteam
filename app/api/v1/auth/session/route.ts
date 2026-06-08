import { NextRequest } from "next/server";

import { MODULE_KEYS } from "@/lib/contracts/enums";
import { mapUserToAuthDTO } from "@/lib/server/auth/map-user";
import { getCurrentUser } from "@/lib/server/auth/session-service";
import { prisma } from "@/lib/server/prisma";
import {
  internalError,
  jsonError,
  jsonSuccess,
  unauthorizedError,
} from "@/lib/server/api/responses";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return jsonError(unauthorizedError());
    }

    const modulePermissions = await prisma.modulePermission.findMany({
            where: {
              userId: user.id,
              moduleKey: { in: [...MODULE_KEYS] },
            },
            select: {
              moduleKey: true,
              canView: true,
              canEdit: true,
              canDelete: true,
            },
          });

    return jsonSuccess({
      user: mapUserToAuthDTO(user),
      modulePermissions,
    });
  } catch (error) {
    console.error("[auth/session]", error);
    return jsonError(internalError());
  }
}
