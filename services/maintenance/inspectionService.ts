import { getDataSourceMode } from "@/lib/data-source/mode";
import {
  InspectionRepositoryHttp,
  type InspectionTemplateDTO,
} from "@/repositories/maintenance/InspectionRepositoryHttp";
import { InspectionRepositoryMock } from "@/repositories/maintenance/InspectionRepositoryMock";
import type { MaintenanceInspectionApiRow } from "@/services/maintenance/map-inspection-api";

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

function getMockTemplate(): InspectionTemplateDTO {
  return {
    typeOptions: InspectionRepositoryMock.getTypeOptions(),
    modules: InspectionRepositoryMock.getModules(),
    diagramZones: InspectionRepositoryMock.getDiagramZones(),
    generalConditionMeta: InspectionRepositoryMock.getGeneralConditionMeta(),
    signatureStaff: InspectionRepositoryMock.getSignatureStaff(),
    technicalTimeline: InspectionRepositoryMock.getTechnicalTimeline(),
    mockDiagnosis: InspectionRepositoryMock.getMockDiagnosis(),
  };
}

export function createInspectionService() {
  return {
    getTemplate: (): Promise<InspectionTemplateDTO> =>
      isHttpMode()
        ? InspectionRepositoryHttp.getTemplate()
        : Promise.resolve(getMockTemplate()),
    getTypeOptions: () => InspectionRepositoryMock.getTypeOptions(),
    getModules: () => InspectionRepositoryMock.getModules(),
    getDiagramZones: () => InspectionRepositoryMock.getDiagramZones(),
    getTechnicalTimeline: () => InspectionRepositoryMock.getTechnicalTimeline(),
    getDefaultKart: () => InspectionRepositoryMock.getDefaultKart(),
    getMockDiagnosis: () => InspectionRepositoryMock.getMockDiagnosis(),
    getSignatureStaff: () => InspectionRepositoryMock.getSignatureStaff(),
    getGeneralConditionMeta: () => InspectionRepositoryMock.getGeneralConditionMeta(),
    buildInitialItemStates: InspectionRepositoryMock.buildInitialItemStates,
    computeInspectionResult: InspectionRepositoryMock.computeInspectionResult,
    listInspections: (kartId?: string): Promise<MaintenanceInspectionApiRow[]> =>
      isHttpMode()
        ? InspectionRepositoryHttp.list(kartId ? { kartId } : undefined).then(
            (rows) => rows as MaintenanceInspectionApiRow[],
          )
        : Promise.resolve([]),
    uploadMedia: (file: File, label?: string) =>
      isHttpMode()
        ? InspectionRepositoryHttp.uploadMedia(file, label)
        : Promise.reject(new Error("Upload disponível apenas em modo HTTP.")),
    createInspection: (payload: Parameters<typeof InspectionRepositoryHttp.create>[0]) =>
      isHttpMode()
        ? InspectionRepositoryHttp.create(payload)
        : Promise.resolve(null),
  };
}

export const InspectionServiceMock = createInspectionService();
