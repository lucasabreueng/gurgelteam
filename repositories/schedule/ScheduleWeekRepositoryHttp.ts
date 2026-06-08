import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";

import { v1ApiPaths } from "@/lib/api/v1-api-paths";

import type {

  ScheduleException,

  SpecificDateSchedule,

  WeekDaySchedule,

} from "@/lib/contracts/settings";

import type { ScheduleHoursConfig } from "@/services/schedule/weekScheduleService";



export const ScheduleWeekRepositoryHttp = {

  async fetchScheduleHoursConfig(): Promise<ScheduleHoursConfig> {

    const res = await apiFetch<ScheduleHoursConfig>(v1ApiPaths.schedule.week);

    return unwrapApiResponse(res);

  },



  async fetchWeekSchedule(): Promise<WeekDaySchedule[]> {

    const config = await ScheduleWeekRepositoryHttp.fetchScheduleHoursConfig();

    return config.days;

  },



  async replaceScheduleHoursConfig(

    config: ScheduleHoursConfig,

  ): Promise<ScheduleHoursConfig> {

    const res = await apiFetch<ScheduleHoursConfig>(v1ApiPaths.schedule.week, {

      method: "PUT",

      body: JSON.stringify(config),

    });

    return unwrapApiResponse(res);

  },



  async replaceWeekSchedule(

    days: WeekDaySchedule[],

  ): Promise<WeekDaySchedule[]> {

    const current = await ScheduleWeekRepositoryHttp.fetchScheduleHoursConfig();

    const config = await ScheduleWeekRepositoryHttp.replaceScheduleHoursConfig({

      ...current,

      days,

    });

    return config.days;

  },

};



export type { ScheduleException, SpecificDateSchedule };


