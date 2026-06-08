import { HydrationBoundary } from "@tanstack/react-query";

import { ClientsPage } from "@/components/admin/clients-page";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { queryKeys } from "@/lib/query/keys";
import { buildPageDehydratedState } from "@/lib/server/pages/hydrate-page-query";
import { loadClientsPageData } from "@/lib/server/pages/load-clients-page";

export const metadata = {
  title: "Clientes — Gurgel Team",
  description:
    "CRM esportivo: gestão de pilotos, performance, feedbacks e relacionamento.",
};

export default async function AdminClientesPage() {
  if (getDataSourceMode() !== "http") {
    return <ClientsPage />;
  }

  const dehydratedState = await buildPageDehydratedState(async (queryClient) => {
    const data = await loadClientsPageData();
    queryClient.setQueryData(queryKeys.clients.pageBundle(), data);
  });

  return (
    <HydrationBoundary state={dehydratedState}>
      <ClientsPage />
    </HydrationBoundary>
  );
}
