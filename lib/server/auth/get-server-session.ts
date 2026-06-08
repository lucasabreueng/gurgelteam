import { cookies } from "next/headers";

import { MODULE_KEYS } from "@/lib/contracts/enums";
import type { SessionResponse } from "@/lib/contracts/api/v1/auth.api.schemas";
import { mapUserToAuthDTO } from "@/lib/server/auth/map-user";
import { SESSION_COOKIE_NAME } from "@/lib/server/auth/constants";
import { findUserBySessionToken } from "@/lib/server/auth/session-service";
import { getUserLegalComplianceStatus } from "@/lib/server/auth/legal-compliance-service";
import type { LegalComplianceStatus } from "@/lib/server/auth/legal-compliance-service";
import { prisma } from "@/lib/server/prisma";

export async function getServerSession(): Promise<SessionResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const user = await findUserBySessionToken(token);
  if (!user || !user.active) return null;

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

  return {
    user: mapUserToAuthDTO(user),
    modulePermissions,
  };
}

export type ServerAreaBootstrap = {
  session: SessionResponse | null;
  legalCompliance: LegalComplianceStatus | null;
};

/** Session + termos legais em uma única ida ao banco (layout RSC). */
export async function getServerAreaBootstrap(): Promise<ServerAreaBootstrap> {
  const session = await getServerSession();
  if (!session) {
    return { session: null, legalCompliance: null };
  }

  const legalCompliance = await getUserLegalComplianceStatus(session.user.id);
  return { session, legalCompliance };
}
