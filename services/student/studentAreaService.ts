import { getDataSourceMode } from "@/lib/data-source/mode";
import { StudentAreaRepositoryHttp } from "@/repositories/student/StudentAreaRepositoryHttp";
import { StudentAreaRepositoryMock } from "@/repositories/student/StudentAreaRepositoryMock";

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

export function createStudentAreaService() {
  return {
    getStudentNav: StudentAreaRepositoryMock.getStudentNav,
    getStudentNavHref: StudentAreaRepositoryMock.getStudentNavHref,
    getStudentProfile: () =>
      isHttpMode()
        ? StudentAreaRepositoryHttp.getHome().then((h) => ({
            firstName: h.profile.firstName,
            tag: h.profile.tag,
            pilotSinceYear: h.profile.pilotSinceYear,
            avatarFallback: h.avatarUrl,
          }))
        : Promise.resolve(StudentAreaRepositoryMock.getStudentProfile()),
    getNextClass: () =>
      isHttpMode()
        ? StudentAreaRepositoryHttp.getHome().then((h) => h.nextClass)
        : Promise.resolve(StudentAreaRepositoryMock.getNextClass()),
    getHeroLevel: () =>
      isHttpMode()
        ? StudentAreaRepositoryHttp.getHome().then((h) => h.heroLevel)
        : Promise.resolve(StudentAreaRepositoryMock.getHeroLevel()),
    getEvolutionLapSeries: () =>
      isHttpMode()
        ? StudentAreaRepositoryHttp.getEvolutionLapSeries()
        : Promise.resolve(StudentAreaRepositoryMock.getEvolutionLapSeries()),
    getEvolutionGoal: () =>
      isHttpMode()
        ? StudentAreaRepositoryHttp.getEvolutionGoal()
        : Promise.resolve(StudentAreaRepositoryMock.getEvolutionGoal()),
    getKpiMetrics: () =>
      isHttpMode()
        ? StudentAreaRepositoryHttp.getHome().then((h) => [...h.kpiMetrics])
        : Promise.resolve(StudentAreaRepositoryMock.getKpiMetrics()),
    getNextActivities: () =>
      isHttpMode()
        ? StudentAreaRepositoryHttp.getHome().then((h) => [...h.nextActivities])
        : Promise.resolve(StudentAreaRepositoryMock.getNextActivities()),
    getFeedback: () =>
      isHttpMode()
        ? StudentAreaRepositoryHttp.getHome().then((h) => ({
            ...h.feedback,
            strengths: [...h.feedback.strengths],
            improve: [...h.feedback.improve],
          }))
        : Promise.resolve(StudentAreaRepositoryMock.getFeedback()),
    getDevelopmentTabs: () =>
      isHttpMode()
        ? StudentAreaRepositoryHttp.getHome().then((h) => [...h.developmentTabs])
        : Promise.resolve(StudentAreaRepositoryMock.getDevelopmentTabs()),
    getDevelopmentByTab: () =>
      isHttpMode()
        ? StudentAreaRepositoryHttp.getHome().then((h) => h.developmentByTab)
        : Promise.resolve(StudentAreaRepositoryMock.getDevelopmentByTab()),
    getAchievements: () =>
      isHttpMode()
        ? StudentAreaRepositoryHttp.getAchievements()
        : Promise.resolve(StudentAreaRepositoryMock.getAchievements()),
    getLastResults: () =>
      isHttpMode()
        ? StudentAreaRepositoryHttp.getHome().then((h) => h.results)
        : Promise.resolve(StudentAreaRepositoryMock.getLastResults()),
    getVideoMaterials: () =>
      isHttpMode()
        ? StudentAreaRepositoryHttp.getHome().then((h) => h.videoMaterials)
        : Promise.resolve(StudentAreaRepositoryMock.getVideoMaterials()),
    getQuickActions: StudentAreaRepositoryMock.getQuickActions,
    getSidebarPlan: StudentAreaRepositoryMock.getSidebarPlan,
    getHome: async () => {
      if (isHttpMode()) {
        return StudentAreaRepositoryHttp.getHome();
      }
      const [
        profile,
        nextClass,
        heroLevel,
        kpiMetrics,
        evolutionLapSeries,
        evolutionGoal,
        nextActivities,
        feedback,
        developmentTabs,
        developmentByTab,
        achievements,
        results,
        videoMaterials,
      ] = await Promise.all([
        Promise.resolve(StudentAreaRepositoryMock.getStudentProfile()),
        Promise.resolve(StudentAreaRepositoryMock.getNextClass()),
        Promise.resolve(StudentAreaRepositoryMock.getHeroLevel()),
        Promise.resolve(StudentAreaRepositoryMock.getKpiMetrics()),
        Promise.resolve(StudentAreaRepositoryMock.getEvolutionLapSeries()),
        Promise.resolve(StudentAreaRepositoryMock.getEvolutionGoal()),
        Promise.resolve(StudentAreaRepositoryMock.getNextActivities()),
        Promise.resolve(StudentAreaRepositoryMock.getFeedback()),
        Promise.resolve(StudentAreaRepositoryMock.getDevelopmentTabs()),
        Promise.resolve(StudentAreaRepositoryMock.getDevelopmentByTab()),
        StudentAreaRepositoryMock.getAchievements(),
        Promise.resolve(StudentAreaRepositoryMock.getLastResults()),
        Promise.resolve(StudentAreaRepositoryMock.getVideoMaterials()),
      ]);
      return {
        profile: {
          firstName: profile.firstName,
          tag: profile.tag,
          pilotSinceYear: profile.pilotSinceYear,
        },
        avatarUrl: profile.avatarFallback,
        heroLevel,
        nextClass,
        kpiMetrics: [...kpiMetrics],
        evolutionLapSeries,
        evolutionGoal,
        nextActivities: [...nextActivities],
        feedback: {
          ...feedback,
          strengths: [...feedback.strengths],
          improve: [...feedback.improve],
        },
        results: [...results],
        videoMaterials: [...videoMaterials],
        developmentTabs: [...developmentTabs],
        developmentByTab,
      };
    },
  };
}

export type StudentAreaService = ReturnType<typeof createStudentAreaService>;
