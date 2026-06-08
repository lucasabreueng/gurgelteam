import { buildLessonSessionsFromEvents } from "./lesson-registration-mocks";
import { patchScheduleEvent } from "./schedule-runtime-store";
import {
  getKartBlockReason,
  getKartByNumber,
  isKartBlockedForOperation,
  setKartStatusByNumber,
} from "./karts-runtime-store";
import { getMergedScheduleEvents } from "./schedule-runtime-store";

export function finalizeLessonRegistrationSideEffects(sessionId: string): void {
  const sessions = buildLessonSessionsFromEvents(getMergedScheduleEvents());
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) return;

  patchScheduleEvent(session.scheduleEventId, { status: "finalizado" });

  if (session.kartNumber <= 0) return;

  const kart = getKartByNumber(session.kartNumber);
  if (!kart) return;

  if (isKartBlockedForOperation(session.kartNumber)) return;

  if (kart.status === "em_treino" || kart.status === "reservado") {
    setKartStatusByNumber(session.kartNumber, "disponivel");
  }
}

export function reserveKartForScheduleEvent(kartNumber: number): void {
  if (kartNumber <= 0) return;
  if (isKartBlockedForOperation(kartNumber)) {
    const reason = getKartBlockReason(kartNumber);
    throw new Error(
      reason
        ? `Kart ${kartNumber} indisponível (${reason}).`
        : `Kart ${kartNumber} indisponível para agendamento.`,
    );
  }
  setKartStatusByNumber(kartNumber, "reservado");
}
