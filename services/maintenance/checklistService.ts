import { getDataSourceMode } from "@/lib/data-source/mode";
import {
  ChecklistRepositoryHttp,
  type ChecklistTemplateDTO,
} from "@/repositories/maintenance/ChecklistRepositoryHttp";
import { ChecklistRepositoryMock } from "@/repositories/maintenance/ChecklistRepositoryMock";

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

function getMockTemplate(): ChecklistTemplateDTO {
  return {
    types: ChecklistRepositoryMock.getTypes(),
    sections: ChecklistRepositoryMock.getSections(),
    diagramViews: ChecklistRepositoryMock.getDiagramViews(),
    diagramZones: ChecklistRepositoryMock.getDiagramZones(),
    overallStatusLabels: ChecklistRepositoryMock.getOverallStatusLabels(),
  };
}

export function createChecklistService() {
  return {
    getTemplate: (): Promise<ChecklistTemplateDTO> =>
      isHttpMode()
        ? ChecklistRepositoryHttp.getTemplate()
        : Promise.resolve(getMockTemplate()),
    getTypes: () =>
      isHttpMode()
        ? ChecklistRepositoryHttp.getTemplate().then((t) => t.types)
        : Promise.resolve(ChecklistRepositoryMock.getTypes()),
    getSections: () =>
      isHttpMode()
        ? ChecklistRepositoryHttp.getTemplate().then((t) => t.sections)
        : Promise.resolve(ChecklistRepositoryMock.getSections()),
    getDefaultKart: () => ChecklistRepositoryMock.getDefaultKart(),
    getSmartAlerts: () =>
      isHttpMode()
        ? ChecklistRepositoryHttp.getContext().then((c) => c.smartAlerts)
        : Promise.resolve(ChecklistRepositoryMock.getSmartAlerts()),
    getHistory: () =>
      isHttpMode()
        ? ChecklistRepositoryHttp.getContext().then((c) => c.history)
        : Promise.resolve(ChecklistRepositoryMock.getHistory()),
    getMediaPreviews: () => ChecklistRepositoryMock.getMediaPreviews(),
    getDiagramViews: () =>
      isHttpMode()
        ? ChecklistRepositoryHttp.getTemplate().then((t) => t.diagramViews)
        : Promise.resolve(ChecklistRepositoryMock.getDiagramViews()),
    getDiagramZones: () =>
      isHttpMode()
        ? ChecklistRepositoryHttp.getTemplate().then((t) => t.diagramZones)
        : Promise.resolve(ChecklistRepositoryMock.getDiagramZones()),
    getOverallStatusLabels: () =>
      isHttpMode()
        ? ChecklistRepositoryHttp.getTemplate().then((t) => t.overallStatusLabels)
        : Promise.resolve(ChecklistRepositoryMock.getOverallStatusLabels()),
    buildInitialItemState: ChecklistRepositoryMock.buildInitialItemState,
    computeInspectionSummary: ChecklistRepositoryMock.computeInspectionSummary,
    getOrderChecklist: (orderId: string) =>
      isHttpMode()
        ? ChecklistRepositoryHttp.getOrderChecklist(orderId)
        : Promise.resolve(null),
    saveOrderChecklist: (orderId: string, data: unknown) =>
      isHttpMode()
        ? ChecklistRepositoryHttp.saveOrderChecklist(orderId, data)
        : Promise.resolve(null),
    uploadMedia: (file: File, label?: string) =>
      isHttpMode()
        ? ChecklistRepositoryHttp.uploadMedia(file, label)
        : Promise.reject(new Error("Upload disponível apenas em modo HTTP.")),
  };
}

export const ChecklistServiceMock = createChecklistService();
