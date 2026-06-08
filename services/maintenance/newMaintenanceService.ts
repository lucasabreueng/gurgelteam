import { getDataSourceMode } from "@/lib/data-source/mode";

import type { MaintenanceKartOption } from "@/lib/contracts/maintenance";

import { KART_STATUS_LABELS, type KartStatus } from "@/lib/admin-karts-mocks";

import { ChecklistRepositoryHttp } from "@/repositories/maintenance/ChecklistRepositoryHttp";

import { KartsRepositoryHttp } from "@/repositories/karts/KartsRepositoryHttp";

import { NewMaintenanceRepositoryMock } from "@/repositories/maintenance/NewMaintenanceRepositoryMock";



function isHttpMode(): boolean {

  return getDataSourceMode() === "http";

}



function mapFleetKartToOption(

  kart: Awaited<ReturnType<typeof KartsRepositoryHttp.getFleet>>[number],

): MaintenanceKartOption {

  const status = (kart.status ?? "disponivel") as KartStatus;

  return {

    id: kart.id,

    number: kart.number,

    photo: kart.photo ?? "",

    categoryName: kart.categoryName ?? "Frota",

    ownerName: kart.ownerName ?? "—",

    status,

    statusLabel: KART_STATUS_LABELS[status] ?? status,

    engineHours: kart.usageHours,

    lastMaintenance: kart.nextMaintenance,

    reliabilityScore: kart.score,

    ownership: kart.ownership ?? "rental",

  };

}



async function searchKartsHttp(query: string): Promise<MaintenanceKartOption[]> {

  const fleet = await KartsRepositoryHttp.getFleet();

  const options = fleet.map(mapFleetKartToOption);

  const q = query.trim().toLowerCase();

  if (!q) return options.slice(0, 6);

  return options.filter((k) => {

    const haystack = [

      String(k.number),

      k.categoryName,

      k.ownerName,

      k.statusLabel,

    ]

      .join(" ")

      .toLowerCase();

    return haystack.includes(q);

  });

}



export function createNewMaintenanceService() {

  return {

    getDefaultResponsible: () =>

      NewMaintenanceRepositoryMock.getDefaultResponsible(),

    generateOsNumber: NewMaintenanceRepositoryMock.generateOsNumber,

    getNowLabel: () => NewMaintenanceRepositoryMock.getNowLabel(),

    getKartOptions: (): Promise<MaintenanceKartOption[]> =>

      isHttpMode()

        ? KartsRepositoryHttp.getFleet().then((fleet) =>

            fleet.map(mapFleetKartToOption),

          )

        : Promise.resolve(NewMaintenanceRepositoryMock.getKartOptions()),

    searchKarts: (query: string): Promise<MaintenanceKartOption[]> =>

      isHttpMode()

        ? searchKartsHttp(query)

        : Promise.resolve(NewMaintenanceRepositoryMock.searchKarts(query)),

    getTypeOptions: () => NewMaintenanceRepositoryMock.getTypeOptions(),

    getPriorityOptions: () => NewMaintenanceRepositoryMock.getPriorityOptions(),

    getOriginOptions: () => NewMaintenanceRepositoryMock.getOriginOptions(),

    getOriginLinkMock: () => NewMaintenanceRepositoryMock.getOriginLinkMock(),

    getDiagnosisAreas: () => NewMaintenanceRepositoryMock.getDiagnosisAreas(),

    buildInitialDiagnosis: NewMaintenanceRepositoryMock.buildInitialDiagnosis,

    getMockProblem: () => NewMaintenanceRepositoryMock.getMockProblem(),

    getPlannedServices: () => NewMaintenanceRepositoryMock.getPlannedServices(),

    getDefaultPlannedServices: () =>

      NewMaintenanceRepositoryMock.getDefaultPlannedServices(),

    getLaborRate: () => NewMaintenanceRepositoryMock.getLaborRate(),

    getTimeline: () => NewMaintenanceRepositoryMock.getTimeline(),

    getSmartAlerts: async () => {

      if (isHttpMode()) {

        const context = await ChecklistRepositoryHttp.getContext();

        return context.smartAlerts.map((a) => ({

          id: a.id,

          message: a.message,

          tone: a.severity,

        }));

      }

      return NewMaintenanceRepositoryMock.getSmartAlerts();

    },

    getAffectedBookings: () =>

      NewMaintenanceRepositoryMock.getAffectedBookings(),

    getSignature: () => NewMaintenanceRepositoryMock.getSignature(),

    searchParts: NewMaintenanceRepositoryMock.searchParts,

    computeEstimatedCosts: NewMaintenanceRepositoryMock.computeEstimatedCosts,

    getDefaultKart: (): Promise<MaintenanceKartOption | null> =>

      isHttpMode()

        ? KartsRepositoryHttp.getFleet().then(

            (fleet) => (fleet[0] ? mapFleetKartToOption(fleet[0]) : null),

          )

        : Promise.resolve(NewMaintenanceRepositoryMock.getDefaultKart()),

  };

}



export const NewMaintenanceServiceMock = createNewMaintenanceService();

