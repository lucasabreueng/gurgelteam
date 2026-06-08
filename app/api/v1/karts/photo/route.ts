import { NextRequest } from "next/server";

import { saveKartPhotoFile } from "@/lib/server/karts/save-kart-photo";
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
  const auth = await requireModulePermission(request, "karts", "edit");
  if (isNextResponse(auth)) return auth;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return jsonError({
        code: "VALIDATION_ERROR",
        message: "Nenhum arquivo enviado.",
        httpStatus: 400,
      });
    }

    const url = await saveKartPhotoFile(file);
    return jsonSuccess({ url }, 201);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha ao enviar imagem.";
    if (
      message.includes("Formato") ||
      message.includes("excede") ||
      message.includes("máximo") ||
      message.includes("vazio")
    ) {
      return jsonError({
        code: "VALIDATION_ERROR",
        message,
        httpStatus: 400,
      });
    }
    console.error("[karts/photo POST]", error);
    return jsonError(internalError());
  }
}
