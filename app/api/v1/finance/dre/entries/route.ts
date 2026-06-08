import { NextRequest } from "next/server";

import { drePeriodQuerySchema } from "@/lib/contracts/api/v1/finance.api.schemas";
import { buildDreAccountEntries } from "@/lib/server/finance/dre-account-entries";
import {
  isNextResponse,
  parseSearchParams,
  requireModulePermission,
} from "@/lib/server/api/require-auth";
import {
  internalError,
  jsonError,
  jsonSuccess,
} from "@/lib/server/api/responses";
import { zUuid } from "@/lib/contracts/api/common.schemas";

export const dynamic = "force-dynamic";

const dreEntriesQuerySchema = drePeriodQuerySchema.extend({
  accountId: zUuid,
});

export async function GET(request: NextRequest) {
  const auth = await requireModulePermission(request, "financeiro", "view");
  if (isNextResponse(auth)) return auth;

  const query = parseSearchParams(request, dreEntriesQuerySchema);
  if (isNextResponse(query)) return query;

  try {
    const data = await buildDreAccountEntries(query.accountId, {
      key: query.key,
      customStart: query.customStart,
      customEnd: query.customEnd,
    });
    return jsonSuccess(data);
  } catch (error) {
    console.error("[finance/dre/entries GET]", error);
    return jsonError(internalError());
  }
}
