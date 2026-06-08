import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import type { ReferenceCatalogDTO } from "@/lib/contracts/api/v1/reference.api.schemas";
import type { KartCategory, SkillLevel } from "@/lib/admin-clients-mocks";
import { toSkillLevelUiId } from "@/lib/reference-data/resolve-reference-ids";

let catalogCache: ReferenceCatalogDTO | null = null;

async function fetchCatalog(): Promise<ReferenceCatalogDTO> {
  if (catalogCache) return catalogCache;
  const res = await apiFetch<ReferenceCatalogDTO>(v1ApiPaths.reference.catalog);
  catalogCache = unwrapApiResponse(res);
  return catalogCache;
}

function mapCategories(catalog: ReferenceCatalogDTO): KartCategory[] {
  return catalog.categories.map((category) => ({
    id: category.slug,
    name: category.name,
  }));
}

function mapSkillLevels(catalog: ReferenceCatalogDTO): SkillLevel[] {
  return catalog.skillLevels.map((level) => ({
    id: toSkillLevelUiId(level.slug),
    name: level.name,
    categoryRequirements: [],
  }));
}

export const ReferenceRepositoryHttp = {
  fetchCatalog,
  async getKartCategories(): Promise<KartCategory[]> {
    const catalog = await fetchCatalog();
    return mapCategories(catalog);
  },
  async getSkillLevels(): Promise<SkillLevel[]> {
    const catalog = await fetchCatalog();
    return mapSkillLevels(catalog);
  },
  clearCache() {
    catalogCache = null;
  },
};
