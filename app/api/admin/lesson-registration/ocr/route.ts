import { NextRequest, NextResponse } from "next/server";

import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import { applyLegacyAdminHeaders } from "@/lib/server/api/legacy-admin-proxy";
import {
  isNextResponse,
  requireModulePermission,
} from "@/lib/server/api/require-auth";
import { processLessonTimingSheetUpload } from "@/lib/server/lessons/lesson-ocr-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SUCCESSOR = v1ApiPaths.lessons.ocr;

export async function POST(request: NextRequest) {
  const auth = await requireModulePermission(request, "registroAulas", "edit");
  if (isNextResponse(auth)) {
    return applyLegacyAdminHeaders(auth, SUCCESSOR);
  }

  const result = await processLessonTimingSheetUpload(await request.formData());

  if (!result.ok) {
    const { httpStatus, message, hint, debug } = result.failure;
    return applyLegacyAdminHeaders(
      NextResponse.json(
        {
          error: message,
          ...(hint ? { hint } : {}),
          ...(debug ? { debug } : {}),
        },
        { status: httpStatus },
      ),
      SUCCESSOR,
    );
  }

  return applyLegacyAdminHeaders(
    NextResponse.json({ laps: result.laps }),
    SUCCESSOR,
  );
}
