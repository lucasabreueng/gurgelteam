import { NextResponse } from "next/server";
import { ScheduleRepositoryMock } from "@/repositories/schedule/ScheduleRepositoryMock";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ eventId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { eventId } = await params;
  const event = ScheduleRepositoryMock.getEventDetail(eventId) ?? null;
  if (!event) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Evento não encontrado.",
          httpStatus: 404,
        },
      },
      { status: 404 },
    );
  }
  return NextResponse.json({ success: true, data: event });
}
