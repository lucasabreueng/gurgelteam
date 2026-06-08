import { dashboardRepository } from "@/lib/server/dashboard/dashboard-repository";

export async function loadDashboardPageData() {
  return dashboardRepository.getSummary();
}
