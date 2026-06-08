import type {

  ScheduleException,

  SpecificDateSchedule,

  WeekDaySchedule,

} from "@/lib/contracts/settings";

import { getDataSourceMode } from "@/lib/data-source/mode";

import { ScheduleWeekRepositoryHttp } from "@/repositories/schedule/ScheduleWeekRepositoryHttp";

import { SettingsRepositoryMock } from "@/repositories/settings/SettingsRepositoryMock";



export type ScheduleHoursConfig = {

  days: WeekDaySchedule[];

  specificDates: SpecificDateSchedule[];

  exceptions: ScheduleException[];

};



function isHttpMode(): boolean {

  return getDataSourceMode() === "http";

}



function mockScheduleHoursConfig(): ScheduleHoursConfig {

  return {

    days: SettingsRepositoryMock.getWeekSchedule(),

    specificDates: SettingsRepositoryMock.getSpecificDateSchedules(),

    exceptions: SettingsRepositoryMock.getScheduleExceptions(),

  };

}



export function createWeekScheduleService() {

  return {

    getScheduleHoursConfig(): Promise<ScheduleHoursConfig> {

      return isHttpMode()

        ? ScheduleWeekRepositoryHttp.fetchScheduleHoursConfig()

        : Promise.resolve(mockScheduleHoursConfig());

    },



    getWeekSchedule(): Promise<WeekDaySchedule[]> {

      return this.getScheduleHoursConfig().then((config) => config.days);

    },



    saveScheduleHoursConfig(

      config: ScheduleHoursConfig,

    ): Promise<ScheduleHoursConfig> {

      return isHttpMode()

        ? ScheduleWeekRepositoryHttp.replaceScheduleHoursConfig(config)

        : Promise.resolve(config);

    },



    saveWeekSchedule(days: WeekDaySchedule[]): Promise<WeekDaySchedule[]> {

      return this.saveScheduleHoursConfig({

        ...mockScheduleHoursConfig(),

        days,

      }).then((config) => config.days);

    },

  };

}


