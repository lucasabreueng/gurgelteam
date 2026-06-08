"use client";



import { useQuery } from "@tanstack/react-query";

import { getAppServices } from "@/lib/data-source/app-services";

import { queryKeys } from "@/lib/query/keys";



export function useScheduleHoursConfig() {

  return useQuery({

    queryKey: queryKeys.schedule.hoursConfig(),

    queryFn: () => getAppServices().weekSchedule.getScheduleHoursConfig(),

    staleTime: 60_000,

  });

}



/** @deprecated Prefer `useScheduleHoursConfig` — mantido por compatibilidade. */

export function useWeekSchedule() {

  const query = useScheduleHoursConfig();

  return {

    ...query,

    data: query.data?.days,

  };

}


