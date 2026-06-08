import * as newClassMocks from "@/lib/admin-new-class-mocks";

export const NewClassRepositoryMock = {
  getOperational: () => newClassMocks.GURGEL_OPERATIONAL,
  getStudents: () => newClassMocks.NEW_CLASS_STUDENTS,
  getAlerts: () => newClassMocks.GURGEL_CLASS_ALERTS,
  getSmartSuggestion: () => newClassMocks.GURGEL_SMART_SUGGESTION,
  getDefaultDate: () => newClassMocks.DEFAULT_CLASS_DATE,
  getDefaultTime: () => newClassMocks.DEFAULT_CLASS_TIME,
  getGurgelEventsForDate: newClassMocks.getGurgelEventsForDate,
  buildGurgelTimeline: newClassMocks.buildGurgelTimeline,
  getDefaultSlotForDate: newClassMocks.getDefaultSlotForDate,
  getSlotStatusForTime: newClassMocks.getSlotStatusForTime,
  getAlertsForSelection: newClassMocks.getAlertsForSelection,
  formatClassDateTime: newClassMocks.formatClassDateTime,
  getKarts: () => newClassMocks.NEW_CLASS_KARTS,
  getThirdPartyKarts: () => newClassMocks.NEW_CLASS_THIRD_PARTY_KARTS,
  getRentalKarts: () => newClassMocks.NEW_CLASS_KARTS,
  getCategoryLabel: newClassMocks.getCategoryLabel,
  getLevelLabel: newClassMocks.getLevelLabel,
};
