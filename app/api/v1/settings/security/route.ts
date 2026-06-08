import { NextRequest } from "next/server";

import { SECURITY_CARDS } from "@/lib/admin-settings-mocks";
import { prisma } from "@/lib/server/prisma";
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
    const activeSessions = await prisma.session.count({
      where: { expiresAt: { gt: new Date() } },
    });

    const cards = SECURITY_CARDS.map((card) =>
      card.id === "sessoes"
        ? {
            ...card,
            description: `${activeSessions} sessão(ões) ativa(s) no momento.`,
          }
        : card,
    );

    return jsonSuccess({ cards });
  } catch (error) {
    console.error("[settings/security GET]", error);
    return jsonError(internalError());
  }
}
