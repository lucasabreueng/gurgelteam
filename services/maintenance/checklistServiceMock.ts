import { ChecklistRepositoryMock } from "@/repositories/maintenance/ChecklistRepositoryMock";

export const ChecklistServiceMock = {
  getTypes: () => ChecklistRepositoryMock.getTypes(),
  getDefaultKart: () => ChecklistRepositoryMock.getDefaultKart(),
  getSections: () => ChecklistRepositoryMock.getSections(),
  getSmartAlerts: () => ChecklistRepositoryMock.getSmartAlerts(),
  getHistory: () => ChecklistRepositoryMock.getHistory(),
  getMediaPreviews: () => ChecklistRepositoryMock.getMediaPreviews(),
  getDiagramViews: () => ChecklistRepositoryMock.getDiagramViews(),
  getDiagramZones: () => ChecklistRepositoryMock.getDiagramZones(),
  getOverallStatusLabels: () => ChecklistRepositoryMock.getOverallStatusLabels(),
  buildInitialItemState: ChecklistRepositoryMock.buildInitialItemState,
  computeInspectionSummary: ChecklistRepositoryMock.computeInspectionSummary,
};
