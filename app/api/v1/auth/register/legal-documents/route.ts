import { loadPublishedRegistrationLegalDocuments } from "@/lib/server/auth/registration-legal-documents";
import { internalError, jsonError, jsonSuccess } from "@/lib/server/api/responses";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const documents = await loadPublishedRegistrationLegalDocuments();
    return jsonSuccess({ documents });
  } catch (error) {
    console.error("[auth/register/legal-documents GET]", error);
    return jsonError(internalError());
  }
}
