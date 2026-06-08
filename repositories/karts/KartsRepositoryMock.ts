import type { NewKartFormData } from "@/lib/contracts/karts";

import * as kartsMocks from "@/lib/admin-karts-mocks";

import { buildKartsKpisFromFleet } from "@/lib/karts/build-karts-kpis";

import { getMergedFleet } from "@/lib/karts-runtime-store";



export const KartsRepositoryMock = {

  getStatusLabels: () => kartsMocks.KART_STATUS_LABELS,

  getFilterCategories: () => kartsMocks.KART_FILTER_CATEGORIES,

  getFilterStatuses: () => kartsMocks.KART_FILTER_STATUSES,

  getMaintenanceWindows: () => kartsMocks.KART_MAINTENANCE_WINDOWS,

  getOwnershipTypeOptions: () => kartsMocks.KART_OWNERSHIP_TYPE_OPTIONS,

  getRegisteredMotors: () => kartsMocks.REGISTERED_MOTORS,

  getKpis: () => buildKartsKpisFromFleet(getMergedFleet()),

  getTablePageSizes: () => kartsMocks.KARTS_TABLE_PAGE_SIZES,

  getFleet: () => getMergedFleet(),

  getFleetAlerts: () => kartsMocks.FLEET_ALERTS,

  getPadlockBoxes: () => kartsMocks.PADLOCK_BOXES,

  getDetail(kartId: string) {

    const list = getMergedFleet().find((k) => k.id === kartId);

    if (!list) return null;

    return kartsMocks.buildKartDetailFromList(list);

  },

  filterByTab: kartsMocks.filterKartsByTab,

  createFromForm(_form: NewKartFormData) {

    return Promise.resolve({

      id: "mock-kart",

      number: Number(_form.number) || 0,

    });

  },

  updateFromForm(kartId: string, _form: NewKartFormData) {

    return Promise.resolve({ id: kartId, number: Number(_form.number) || 0 });

  },

  removeKart(_kartId: string) {

    /* mock: no-op */

  },

};

