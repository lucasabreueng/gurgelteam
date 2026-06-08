"use client";

import { useQuery } from "@tanstack/react-query";
import { KART_FILTER_CATEGORIES } from "@/lib/admin-karts-mocks";
import { getAppServices } from "@/lib/data-source/app-services";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { catalogToUiState } from "@/lib/settings/map-catalog-ui";
import { queryKeys } from "@/lib/query/keys";

export type KartCategoryOption = {
  id: string;
  name: string;
};

export function useKartCategories() {
  const isHttp = getDataSourceMode() === "http";

  return useQuery({
    queryKey: queryKeys.karts.categories(),
    queryFn: async (): Promise<KartCategoryOption[]> => {
      if (!isHttp) {
        return KART_FILTER_CATEGORIES.map((category) => ({
          id: category.id,
          name: category.name,
        }));
      }
      const catalog = await getAppServices().settings.getSettingsCatalog();
      return catalogToUiState(catalog).categories.map((category) => ({
        id: category.id,
        name: category.name,
      }));
    },
  });
}
