import * as newClassMocks from "@/lib/admin-new-class-mocks";

export const NewClassRepositoryMock = {
  getScheduleInstructorId: () => newClassMocks.GURGEL_SCHEDULE_INSTRUCTOR_ID,
  getInstructor: () => newClassMocks.GURGEL_INSTRUCTOR,
  getStudents: () => newClassMocks.NEW_CLASS_STUDENTS,
  getRentalKarts: () => newClassMocks.NEW_CLASS_KARTS,
  getThirdPartyKarts: () => newClassMocks.NEW_CLASS_THIRD_PARTY_KARTS,
  getClassAlerts: () => newClassMocks.GURGEL_CLASS_ALERTS,
  getSmartSuggestion: () => newClassMocks.GURGEL_SMART_SUGGESTION,
  getDefaultClassDate: () => newClassMocks.DEFAULT_CLASS_DATE,
  getDefaultClassTime: () => newClassMocks.DEFAULT_CLASS_TIME,
  getGurgelEventsForDate: newClassMocks.getGurgelEventsForDate,
  buildGurgelTimeline: newClassMocks.buildGurgelTimeline,
  getDefaultSlotForDate: newClassMocks.getDefaultSlotForDate,
  getSlotStatusForTime: newClassMocks.getSlotStatusForTime,
  getAlertsForSelection: newClassMocks.getAlertsForSelection,
  formatClassDateTime: newClassMocks.formatClassDateTime,
  getCategoryLabel: newClassMocks.getCategoryLabel,
  getLevelLabel: newClassMocks.getLevelLabel,
};
