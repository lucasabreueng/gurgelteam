import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";

import {

  mapLessonRegistrationPayloadToUi,

  mapLessonSessionDtoToUi,

} from "@/lib/api/mappers/v1-mappers";

import { v1ApiPaths } from "@/lib/api/v1-api-paths";

import type { LessonSessionApiDTO } from "@/lib/contracts/api/v1/lessons.api.schemas";

import type {

  LessonRegistrationQueryDTO,

  LessonSessionDTO,

} from "@/lib/contracts/lessons/lesson.types";

import type {

  GurgelSessionNotesDTO,

  LapRowDTO,

  LessonRegistrationDTO,

  LessonRegistrationMethod,

} from "@/lib/contracts/lessons/lesson-registration.types";

import { ScheduleRepositoryHttp } from "@/repositories/schedule/ScheduleRepositoryHttp";



const registrationCache = new Map<string, LessonRegistrationDTO>();



function buildSessionsUrl(
  query: LessonRegistrationQueryDTO,
  extra?: { days?: number },
): string {
  const params = new URLSearchParams({
    date: query.date,
    statusFilter: query.statusFilter,
    category: query.category,
    search: query.search,
  });
  if (extra?.days) {
    params.set("days", String(extra.days));
  }
  return `${v1ApiPaths.lessons.sessions}?${params.toString()}`;
}



export const LessonRepositoryHttp = {

  async fetchSessions(

    query: LessonRegistrationQueryDTO,

  ): Promise<LessonSessionDTO[]> {

    const res = await apiFetch<LessonSessionApiDTO[]>(

      buildSessionsUrl(query),

    );

    const data = unwrapApiResponse(res);

    return data.map(mapLessonSessionDtoToUi);

  },



  async fetchSessionsForWeek(fromDate: string): Promise<LessonSessionDTO[]> {
    const res = await apiFetch<LessonSessionApiDTO[]>(
      buildSessionsUrl(
        {
          date: fromDate,
          statusFilter: "",
          category: "",
          search: "",
        },
        { days: 7 },
      ),
    );
    const data = unwrapApiResponse(res);
    return data.map(mapLessonSessionDtoToUi);
  },



  async getDefaultSelectedDate(): Promise<string> {

    const meta = await ScheduleRepositoryHttp.fetchMeta();

    return meta.today;

  },



  async fetchSessionById(sessionId: string): Promise<LessonSessionApiDTO> {

    const res = await apiFetch<LessonSessionApiDTO>(

      v1ApiPaths.lessons.sessionById(sessionId),

    );

    return unwrapApiResponse(res);

  },



  async fetchLessonRegistration(

    sessionId: string,

  ): Promise<LessonRegistrationDTO | null> {

    const cached = registrationCache.get(sessionId);

    if (cached) return cached;



    const session = await LessonRepositoryHttp.fetchSessionById(sessionId);

    if (!session.registration) return null;



    const registration = mapLessonRegistrationPayloadToUi(

      sessionId,

      session.registration,

    );

    registrationCache.set(sessionId, registration);

    return registration;

  },



  getLessonRegistration(sessionId: string): LessonRegistrationDTO | null {

    return registrationCache.get(sessionId) ?? null;

  },



  async saveLessonRegistration(input: {

    sessionId: string;

    laps: LapRowDTO[];

    notes: GurgelSessionNotesDTO;

    method: LessonRegistrationMethod;

    telemetryId?: string;

    telemetrySessionId?: string;

  }): Promise<void> {

    const telemetrySessionId =

      input.telemetrySessionId ?? input.telemetryId ?? undefined;



    const res = await apiFetch<{ sessionId: string; status: string; lapsCount: number }>(

      v1ApiPaths.lessons.register(input.sessionId),

      {

        method: "POST",

        body: JSON.stringify({

          sessionId: input.sessionId,

          laps: input.laps,

          notes: input.notes,

          method: input.method,

          telemetrySessionId,

        }),

      },

    );

    unwrapApiResponse(res);

    registrationCache.set(input.sessionId, {

      sessionId: input.sessionId,

      laps: input.laps,

      notes: input.notes,

      method: input.method,

      telemetryId: telemetrySessionId,

      savedAt: new Date().toISOString(),

    });

  },

};


