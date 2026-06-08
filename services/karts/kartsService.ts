import type { KartDetail } from "@/lib/admin-karts-mocks";
import type { NewKartFormData } from "@/lib/contracts/karts";
import type {
  CreateKartRequest,
  UpdateKartRequest,
} from "@/lib/contracts/api/v1/karts.api.schemas";
import { getDataSourceMode } from "@/lib/data-source/mode";
import {
  loadKartChassisTerms,
  loadKartMotorTerms,
  resolveChassisName,
  resolveMotorName,
} from "@/lib/karts/kart-terms";
import { KartsRepositoryHttp } from "@/repositories/karts/KartsRepositoryHttp";
import { KartsRepositoryMock } from "@/repositories/karts/KartsRepositoryMock";

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

async function formToCreatePayload(form: NewKartFormData): Promise<CreateKartRequest> {
  const [motors, chassisList] = await Promise.all([
    loadKartMotorTerms(),
    loadKartChassisTerms(),
  ]);
  return {
    number: Number(form.number),
    categoryId: form.categoryId,
    ownership: form.ownershipType === "client" ? "client" : "rental",
    clientId: form.ownershipType === "client" ? form.clientId : null,
    motorRef: resolveMotorName(form.motor, motors),
    chassisRef: resolveChassisName(form.chassis, chassisList),
    photoUrl: form.photo.trim() || null,
    engineHours: Number(form.engineHours) || 0,
    lastMaintenanceAt: form.lastMaintenanceUnknown
      ? null
      : form.lastMaintenanceDate || null,
  };
}

async function formToUpdatePayload(form: NewKartFormData): Promise<UpdateKartRequest> {
  const [motors, chassisList] = await Promise.all([
    loadKartMotorTerms(),
    loadKartChassisTerms(),
  ]);
  return {
    number: Number(form.number),
    categoryId: form.categoryId || undefined,
    ownership: form.ownershipType === "client" ? "client" : "rental",
    clientId: form.ownershipType === "client" ? form.clientId : null,
    motorRef: resolveMotorName(form.motor, motors),
    chassisRef: resolveChassisName(form.chassis, chassisList),
    photoUrl: form.photo.trim() || null,
    engineHours: Number(form.engineHours) || 0,
  };
}

export function createKartsService() {
  return {
    getStatusLabels: () => KartsRepositoryMock.getStatusLabels(),
    getFilterCategories: () => KartsRepositoryMock.getFilterCategories(),
    getFilterStatuses: () => KartsRepositoryMock.getFilterStatuses(),
    getMaintenanceWindows: () => KartsRepositoryMock.getMaintenanceWindows(),
    getOwnershipTypeOptions: () => KartsRepositoryMock.getOwnershipTypeOptions(),
    getRegisteredMotors: () => KartsRepositoryMock.getRegisteredMotors(),
    getKpis: () =>
      isHttpMode()
        ? KartsRepositoryHttp.getKpis()
        : Promise.resolve(KartsRepositoryMock.getKpis()),
    getPageBundle: () =>
      isHttpMode()
        ? KartsRepositoryHttp.getPageBundle()
        : Promise.resolve({
            fleet: KartsRepositoryMock.getFleet(),
            kpis: KartsRepositoryMock.getKpis(),
          }),
    getTablePageSizes: () => KartsRepositoryMock.getTablePageSizes(),
    getFleet: () =>
      isHttpMode()
        ? KartsRepositoryHttp.getFleet()
        : Promise.resolve(KartsRepositoryMock.getFleet()),
    getFleetAlerts: () =>
      isHttpMode()
        ? KartsRepositoryHttp.getPaddock().then((p) => p.alerts)
        : Promise.resolve(KartsRepositoryMock.getFleetAlerts()),
    getPadlockBoxes: () =>
      isHttpMode()
        ? KartsRepositoryHttp.getPaddock().then((p) => p.boxes)
        : Promise.resolve(KartsRepositoryMock.getPadlockBoxes()),
    getDetail(kartId: string): KartDetail | null | Promise<KartDetail | null> {
      return isHttpMode()
        ? KartsRepositoryHttp.getDetail(kartId)
        : KartsRepositoryMock.getDetail(kartId);
    },
    filterByTab: KartsRepositoryMock.filterByTab,

    createKart(form: NewKartFormData) {
      if (!isHttpMode()) {
        return Promise.resolve(KartsRepositoryMock.createFromForm(form));
      }
      return formToCreatePayload(form).then((payload) =>
        KartsRepositoryHttp.createKart(payload),
      );
    },

    updateKart(kartId: string, form: NewKartFormData) {
      if (!isHttpMode()) {
        return Promise.resolve(KartsRepositoryMock.updateFromForm(kartId, form));
      }
      return formToUpdatePayload(form).then((payload) =>
        KartsRepositoryHttp.updateKart(kartId, payload),
      );
    },

    removeKart(kartId: string) {
      if (!isHttpMode()) {
        KartsRepositoryMock.removeKart(kartId);
        return Promise.resolve();
      }
      return KartsRepositoryHttp.removeKart(kartId);
    },
  };
}

export type KartsService = ReturnType<typeof createKartsService>;

export const KartsServiceMock = createKartsService();
