import { referenceCatalogSchema } from "@/lib/contracts/api/v1/reference.api.schemas";
import { referenceRepository } from "@/lib/server/reference/reference-repository";
import {
  internalError,
  jsonError,
  jsonSuccess,
} from "@/lib/server/api/responses";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await referenceRepository.getCatalog();
    const parsed = referenceCatalogSchema.safeParse(data);
    if (!parsed.success) {
      console.error("[reference/catalog]", parsed.error);
      return jsonError(internalError());
    }
    return jsonSuccess(parsed.data);
  } catch (error) {
    console.error("[reference/catalog GET]", error);
    return jsonError(internalError());
  }
}
