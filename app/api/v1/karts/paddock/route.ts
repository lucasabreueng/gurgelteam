import { NextRequest } from "next/server";

import { buildKartsPaddock } from "@/lib/server/karts/build-karts-paddock";
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
  const auth = await requireModulePermission(request, "karts", "view");
  if (isNextResponse(auth)) return auth;

  try {
    const data = await buildKartsPaddock();
    return jsonSuccess(data);
  } catch (error) {
    console.error("[karts/paddock GET]", error);
    return jsonError(internalError());
  }
}
