"use client";

import { useQuery } from "@tanstack/react-query";
import type { LessonRegistrationQueryDTO } from "@/lib/contracts/lessons/lesson.types";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useLessonSessions(query: LessonRegistrationQueryDTO) {
  return useQuery({
    queryKey: queryKeys.lessons.sessions(query),
    queryFn: () => getAppServices().lessons.listSessions(query),
  });
}

export function useLessonSessionsAll() {
  return useQuery({
    queryKey: [...queryKeys.lessons.all, "all-with-overrides"] as const,
    queryFn: () => getAppServices().lessons.getAllSessionsWithOverrides(),
  });
}
