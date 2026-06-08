"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LessonRegistrationQueryDTO } from "@/lib/contracts/lessons/lesson.types";
import type { LessonRegistrationDTO } from "@/lib/contracts/lessons/lesson-registration.types";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useLessonDefaultDate() {
  return useQuery({
    queryKey: [...queryKeys.lessons.all, "default-date"] as const,
    queryFn: () => getAppServices().lessons.getDefaultSelectedDate(),
  });
}

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

export function useLessonRegistration(sessionId: string | null) {
  return useQuery({
    queryKey: [...queryKeys.lessons.all, "registration", sessionId] as const,
    queryFn: () =>
      Promise.resolve(
        getAppServices().lessons.getLessonRegistration(sessionId!),
      ),
    enabled: Boolean(sessionId),
  });
}

export function useSaveLessonRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      input: Omit<LessonRegistrationDTO, "savedAt"> & { savedAt?: string },
    ) =>
      Promise.resolve(
        getAppServices().lessons.saveLessonRegistration({
          ...input,
          savedAt: input.savedAt ?? new Date().toISOString(),
        }),
      ),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.lessons.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.schedule.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.karts.all });
      void queryClient.invalidateQueries({
        queryKey: [...queryKeys.lessons.all, "registration", variables.sessionId],
      });
    },
  });
}
