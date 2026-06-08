import { NextRequest, NextResponse } from "next/server";

import { processLessonTimingSheetUpload } from "@/lib/server/lessons/lesson-ocr-handler";
import {
  isNextResponse,
  requireModulePermission,
} from "@/lib/server/api/require-auth";
import { jsonError, jsonSuccess, unauthorizedError } from "@/lib/server/api/responses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const auth = await requireModulePermission(request, "registroAulas", "edit");
  if (isNextResponse(auth)) return auth;

  const result = await processLessonTimingSheetUpload(await request.formData());

  if (!result.ok) {
    const { httpStatus, message, hint, debug } = result.failure;
    if (httpStatus === 503) {
      return jsonError({
        code: "SERVICE_UNAVAILABLE",
        message,
        httpStatus,
      });
    }
    if (httpStatus === 422) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message,
            httpStatus,
            details: {
              ...(hint ? { hint } : {}),
              ...(debug ? { debug } : {}),
            },
          },
        },
        { status: 422 },
      );
    }
    return jsonError({
      code: httpStatus === 400 ? "VALIDATION_ERROR" : "INTERNAL_ERROR",
      message,
      httpStatus,
    });
  }

  return jsonSuccess({ laps: result.laps });
}

export async function GET() {
  return jsonError(unauthorizedError("Método não permitido."));
}
