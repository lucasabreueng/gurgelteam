import type { Metadata } from "next";
import { HydrationBoundary } from "@tanstack/react-query";

import { AdminDashboardPage } from "@/components/admin/admin-dashboard-page";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { queryKeys } from "@/lib/query/keys";
import { buildPageDehydratedState } from "@/lib/server/pages/hydrate-page-query";
import { loadDashboardPageData } from "@/lib/server/pages/load-dashboard-page";

export const metadata: Metadata = {
  title: "Painel Administrativo — Gurgel Team",
  description:
    "Dashboard operacional: alunos, agenda, karts, telemetria e financeiro.",
};

export default async function AdminPage() {
  if (getDataSourceMode() !== "http") {
    return <AdminDashboardPage />;
  }

  const dehydratedState = await buildPageDehydratedState(async (queryClient) => {
    const summary = await loadDashboardPageData();
    queryClient.setQueryData(queryKeys.dashboard.summary(), summary);
  });

  return (
    <HydrationBoundary state={dehydratedState}>
      <AdminDashboardPage />
    </HydrationBoundary>
  );
}
