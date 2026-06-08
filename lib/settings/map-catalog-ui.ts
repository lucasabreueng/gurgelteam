import type { SettingsCatalogApiDTO } from "@/lib/contracts/api/v1/settings.api.schemas";
import type {
  CategoryPrice,
  KartCategory,
  SkillLevel,
} from "@/lib/contracts/settings";

export function catalogToUiState(dto: SettingsCatalogApiDTO): {
  categories: KartCategory[];
  prices: CategoryPrice[];
  levels: SkillLevel[];
} {
  const categories: KartCategory[] = dto.categories.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  const prices: CategoryPrice[] = dto.categories.map((c) => ({
    id: c.id,
    name: c.name,
    singleLessonPriceCents: c.pricePerLessonCents,
    description: c.description ?? "",
    includedItems: c.includedItems ?? "",
  }));

  const levels: SkillLevel[] = dto.skillLevels.map((l) => ({
    id: l.id,
    name: l.name,
    categoryRequirements: l.categoryRequirements.map((r) => ({ ...r })),
  }));

  return { categories, prices, levels };
}

export function uiStateToCatalogPayload(
  categories: KartCategory[],
  prices: CategoryPrice[],
  levels: SkillLevel[],
): SettingsCatalogApiDTO {
  return {
    categories: categories.map((cat, index) => {
      const price = prices.find((p) => p.id === cat.id);
      return {
        id: cat.id,
        name: cat.name,
        pricePerLessonCents: price?.singleLessonPriceCents ?? 0,
        description: price?.description ?? null,
        includedItems: price?.includedItems ?? null,
        sortOrder: index,
      };
    }),
    skillLevels: levels.map((l) => ({
      id: l.id,
      name: l.name,
      categoryRequirements: l.categoryRequirements.map((r) => ({ ...r })),
    })),
  };
}
