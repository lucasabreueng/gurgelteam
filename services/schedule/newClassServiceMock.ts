import { NewClassRepositoryMock } from "@/repositories/schedule/NewClassRepositoryMock";

export const NewClassServiceMock = {
  getScheduleInstructorId: () => NewClassRepositoryMock.getScheduleInstructorId(),
  getInstructor: () => NewClassRepositoryMock.getInstructor(),
  getStudents: () => NewClassRepositoryMock.getStudents(),
  getRentalKarts: () => NewClassRepositoryMock.getRentalKarts(),
  getThirdPartyKarts: () => NewClassRepositoryMock.getThirdPartyKarts(),
  getClassAlerts: () => NewClassRepositoryMock.getClassAlerts(),
  getSmartSuggestion: () => NewClassRepositoryMock.getSmartSuggestion(),
  getDefaultClassDate: () => NewClassRepositoryMock.getDefaultClassDate(),
  getDefaultClassTime: () => NewClassRepositoryMock.getDefaultClassTime(),
  getGurgelEventsForDate: NewClassRepositoryMock.getGurgelEventsForDate,
  buildGurgelTimeline: NewClassRepositoryMock.buildGurgelTimeline,
  getDefaultSlotForDate: NewClassRepositoryMock.getDefaultSlotForDate,
  getSlotStatusForTime: NewClassRepositoryMock.getSlotStatusForTime,
  getAlertsForSelection: NewClassRepositoryMock.getAlertsForSelection,
  formatClassDateTime: NewClassRepositoryMock.formatClassDateTime,
  getCategoryLabel: NewClassRepositoryMock.getCategoryLabel,
  getLevelLabel: NewClassRepositoryMock.getLevelLabel,
};
