import { StudentAreaRepositoryMock } from "@/repositories/student/StudentAreaRepositoryMock";

export const StudentAreaServiceMock = {
  getStudentNav: StudentAreaRepositoryMock.getStudentNav,
  getStudentNavHref: StudentAreaRepositoryMock.getStudentNavHref,
  getStudentProfile: StudentAreaRepositoryMock.getStudentProfile,
  getNextClass: StudentAreaRepositoryMock.getNextClass,
  getHeroLevel: StudentAreaRepositoryMock.getHeroLevel,
  getEvolutionLapSeries: StudentAreaRepositoryMock.getEvolutionLapSeries,
  getEvolutionGoal: StudentAreaRepositoryMock.getEvolutionGoal,
  getKpiMetrics: StudentAreaRepositoryMock.getKpiMetrics,
  getNextActivities: StudentAreaRepositoryMock.getNextActivities,
  getFeedback: StudentAreaRepositoryMock.getFeedback,
  getDevelopmentTabs: StudentAreaRepositoryMock.getDevelopmentTabs,
  getDevelopmentByTab: StudentAreaRepositoryMock.getDevelopmentByTab,
  getAchievements: StudentAreaRepositoryMock.getAchievements,
  getLastResults: StudentAreaRepositoryMock.getLastResults,
  getVideoMaterials: StudentAreaRepositoryMock.getVideoMaterials,
  getQuickActions: StudentAreaRepositoryMock.getQuickActions,
  getSidebarPlan: StudentAreaRepositoryMock.getSidebarPlan,
  getSidebarCompete: StudentAreaRepositoryMock.getSidebarCompete,
};
