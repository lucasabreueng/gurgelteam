import * as checklistMocks from "@/lib/admin-checklist-mocks";

export const ChecklistRepositoryMock = {
  getTypes: () => checklistMocks.CHECKLIST_TYPES,
  getDefaultKart: () => checklistMocks.DEFAULT_CHECKLIST_KART,
  getSections: () => checklistMocks.INSPECTION_SECTIONS,
  getSmartAlerts: () => checklistMocks.CHECKLIST_SMART_ALERTS,
  getHistory: () => checklistMocks.CHECKLIST_HISTORY,
  getMediaPreviews: () => checklistMocks.MOCK_MEDIA_PREVIEWS,
  getDiagramViews: () => checklistMocks.KART_DIAGRAM_VIEWS,
  getDiagramZones: () => checklistMocks.DIAGRAM_ZONES,
  getOverallStatusLabels: () => checklistMocks.OVERALL_STATUS_LABELS,
  buildInitialItemState: checklistMocks.buildInitialItemState,
  computeInspectionSummary: checklistMocks.computeInspectionSummary,
};
