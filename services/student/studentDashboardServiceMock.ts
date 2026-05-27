import { StudentDashboardRepositoryMock } from "@/repositories/student/StudentDashboardRepositoryMock";

export const StudentDashboardServiceMock = {
  getStudentSessionKind: StudentDashboardRepositoryMock.getStudentSessionKind,
  getPilotViewOptions: StudentDashboardRepositoryMock.getPilotViewOptions,
  getDefaultPilotViewId: StudentDashboardRepositoryMock.getDefaultPilotViewId,
  getDashboardViewData: StudentDashboardRepositoryMock.getDashboardViewData,
};
