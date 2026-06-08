import { NextRequest } from "next/server";

import { saveChecklistMediaFile } from "@/lib/server/maintenance/save-checklist-media";
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

export async function POST(request: NextRequest) {
  const auth = await requireModulePermission(request, "manutencao", "edit");
  if (isNextResponse(auth)) return auth;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const label = formData.get("label");

    if (!file || !(file instanceof File)) {
      return jsonError({
        code: "VALIDATION_ERROR",
        message: "Nenhum arquivo enviado.",
        httpStatus: 400,
      });
    }

    const data = await saveChecklistMediaFile(
      file,
      typeof label === "string" ? label : undefined,
    );
    return jsonSuccess(data, 201);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha ao enviar arquivo.";
    if (
      message.includes("Formato") ||
      message.includes("excede") ||
      message.includes("vazio")
    ) {
      return jsonError({
        code: "VALIDATION_ERROR",
        message,
        httpStatus: 400,
      });
    }
    console.error("[maintenance/inspections/media POST]", error);
    return jsonError(internalError());
  }
}
