import { NextResponse } from "next/server";
import { buildScheduleMetaDTO } from "@/repositories/schedule/schedule-api-handlers";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: buildScheduleMetaDTO(),
  });
}
