import { NextResponse } from "next/server";
import { ScheduleRepositoryMock } from "@/repositories/schedule/ScheduleRepositoryMock";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: ScheduleRepositoryMock.getEvents(),
  });
}
