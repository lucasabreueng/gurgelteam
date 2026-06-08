import type { DashboardViewData } from "@/lib/contracts/student/dashboard-view";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { StudentAreaRepositoryHttp } from "@/repositories/student/StudentAreaRepositoryHttp";
import { StudentDashboardRepositoryMock } from "@/repositories/student/StudentDashboardRepositoryMock";
import { createStudentProfileService as buildStudentProfileService } from "@/services/student/studentProfileService";

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

export function createStudentDashboardService() {
  return {
    getStudentSessionKind: StudentDashboardRepositoryMock.getStudentSessionKind,
    getPilotViewOptions: StudentDashboardRepositoryMock.getPilotViewOptions,
    getDefaultPilotViewId: StudentDashboardRepositoryMock.getDefaultPilotViewId,
    getDashboardViewData: (pilotViewId: string): Promise<DashboardViewData> => {
      const base =
        StudentDashboardRepositoryMock.getDashboardViewData(pilotViewId);
      if (!isHttpMode()) {
        return Promise.resolve(base);
      }

      return StudentAreaRepositoryHttp.getHome().then((home) => ({
        profile: home.profile,
        heroLevel: home.heroLevel,
        kpiMetrics: home.kpiMetrics.map((kpi) => ({
          ...kpi,
          sub: kpi.sub ?? "",
        })),
        evolutionLapSeries: home.evolutionLapSeries,
        evolutionGoal: home.evolutionGoal,
        nextActivities: [...home.nextActivities],
        feedback: {
          ...home.feedback,
          strengths: [...home.feedback.strengths],
          improve: [...home.feedback.improve],
        },
      }));
    },
  };
}

export function createStudentProfileService() {
  return buildStudentProfileService();
}

export type StudentDashboardService = ReturnType<
  typeof createStudentDashboardService
>;
export type StudentProfileService = ReturnType<typeof createStudentProfileService>;

export const StudentDashboardServiceMock = createStudentDashboardService();
export const StudentProfileServiceMock = createStudentProfileService();
