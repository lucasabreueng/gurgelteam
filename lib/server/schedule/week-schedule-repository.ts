import { randomUUID } from "crypto";



import type { Prisma } from "@prisma/client";



import type { WeekDayKey, WeekDaySchedule } from "@/lib/admin-settings-mocks";

import { WEEK_SCHEDULE } from "@/lib/admin-settings-mocks";

import { mapScheduleSlotRecordToUi } from "@/lib/schedule/map-schedule-slot-dto";
import {
  resolveCategoryIdsForDb,
  resolveLevelIdsForDb,
} from "@/lib/schedule/schedule-slot-selection";
import { prisma } from "@/lib/server/prisma";
import {
  isPersistedUuid,
} from "@/lib/server/schedule/schedule-hours-utils";



const UI_DAY_ORDER: WeekDayKey[] = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];



const DAY_KEY_TO_INDEX: Record<WeekDayKey, number> = {

  dom: 0,

  seg: 1,

  ter: 2,

  qua: 3,

  qui: 4,

  sex: 5,

  sab: 6,

};



const DAY_TEMPLATE = Object.fromEntries(

  WEEK_SCHEDULE.map((day) => [day.dayKey, day]),

) as Record<WeekDayKey, WeekDaySchedule>;



function isPersistedSlotId(id: string): boolean {

  return isPersistedUuid(id);

}



type Tx = Prisma.TransactionClient;



function emptyWeekDay(dayKey: WeekDayKey): WeekDaySchedule {

  const template = DAY_TEMPLATE[dayKey];

  return {

    dayKey,

    label: template?.label ?? dayKey,

    shortLabel: template?.shortLabel ?? dayKey,

    slots: [],

  };

}



export const weekScheduleRepository = {

  async getWeekSchedule(tx: Tx | typeof prisma = prisma): Promise<WeekDaySchedule[]> {

    const rows = await tx.weekScheduleSlot.findMany({

      orderBy: [{ dayOfWeek: "asc" }, { sortOrder: "asc" }, { startTime: "asc" }],

    });



    const slotsByDay = new Map<number, WeekDaySchedule["slots"]>();

    for (const row of rows) {

      const slot = mapScheduleSlotRecordToUi({
        id: row.id,
        startTime: row.startTime,
        endTime: row.endTime,
        categoryIds: row.categoryIds,
        levelIds: row.levelIds,
      });

      const list = slotsByDay.get(row.dayOfWeek) ?? [];

      list.push(slot);

      slotsByDay.set(row.dayOfWeek, list);

    }



    return UI_DAY_ORDER.map((dayKey) => {

      const template = DAY_TEMPLATE[dayKey] ?? emptyWeekDay(dayKey);

      const dayOfWeek = DAY_KEY_TO_INDEX[dayKey];

      return {

        dayKey,

        label: template.label,

        shortLabel: template.shortLabel,

        slots: slotsByDay.get(dayOfWeek) ?? [],

      };

    });

  },



  async replaceWeekSchedule(

    days: WeekDaySchedule[],

    tx: Tx | typeof prisma = prisma,

  ): Promise<WeekDaySchedule[]> {

    const rows = days.flatMap((day) => {

      const dayOfWeek = DAY_KEY_TO_INDEX[day.dayKey];

      return day.slots.map((slot, sortOrder) => ({

        id: isPersistedSlotId(slot.id) ? slot.id : randomUUID(),

        dayOfWeek,

        startTime: slot.start,

        endTime: slot.end,

        categoryIds: resolveCategoryIdsForDb(slot.categoryIds),
        levelIds: resolveLevelIdsForDb(slot.levelIds),

        sortOrder,

      }));

    });



    await tx.weekScheduleSlot.deleteMany();

    if (rows.length > 0) {

      await tx.weekScheduleSlot.createMany({ data: rows });

    }



    return weekScheduleRepository.getWeekSchedule(tx);

  },

};


