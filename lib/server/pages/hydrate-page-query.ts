import {
  QueryClient,
  dehydrate,
  type DehydratedState,
} from "@tanstack/react-query";

export async function buildPageDehydratedState(
  seed: (queryClient: QueryClient) => void | Promise<void>,
): Promise<DehydratedState> {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 120_000,
        refetchOnWindowFocus: false,
      },
    },
  });

  await seed(queryClient);
  return dehydrate(queryClient);
}
