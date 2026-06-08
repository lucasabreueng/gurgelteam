import { NextRequest } from "next/server";

import { suggestUsernameQuerySchema } from "@/lib/contracts/api/v1/auth.api.schemas";
import { registerService } from "@/lib/server/auth/register-service";
import { parseSearchParams } from "@/lib/server/api/require-auth";
import {
  internalError,
  jsonError,
  jsonSuccess,
  serviceUnavailableError,
} from "@/lib/server/api/responses";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = parseSearchParams(request, suggestUsernameQuerySchema);
  if (query instanceof Response) return query;

  try {
    const username = await registerService.suggestUsername(
      query.firstName,
      query.lastName,
    );
    return jsonSuccess({ username });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "PrismaClientInitializationError" ||
        error.message.includes("Can't reach database"))
    ) {
      return jsonError(
        serviceUnavailableError(
          "Não foi possível conectar ao banco de dados. Verifique DATABASE_URL.",
        ),
      );
    }

    console.error("[auth/register/suggest-username]", error);
    return jsonError(internalError());
  }
}
