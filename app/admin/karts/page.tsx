import { HydrationBoundary } from "@tanstack/react-query";

import { KartsPage } from "@/components/admin/karts-page";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { queryKeys } from "@/lib/query/keys";
import { buildPageDehydratedState } from "@/lib/server/pages/hydrate-page-query";
import { loadKartsPageData } from "@/lib/server/pages/load-karts-page";

export const metadata = {
  title: "Karts — Gurgel Team",
  description:
    "Gestão de frota e paddock: disponibilidade, manutenção e performance dos karts.",
};

export default async function AdminKartsPage() {
  if (getDataSourceMode() !== "http") {
    return <KartsPage />;
  }

  const dehydratedState = await buildPageDehydratedState(async (queryClient) => {
    const data = await loadKartsPageData();
    queryClient.setQueryData(queryKeys.karts.pageBundle(), data);
  });

  return (
    <HydrationBoundary state={dehydratedState}>
      <KartsPage />
    </HydrationBoundary>
  );
}
