import {

  REFERENCE_CATEGORY_DEFS,

  REFERENCE_SKILL_LEVEL_DEFS,

} from "@/lib/reference-data/seed-reference-ids";

import {

  isReferenceUuid,

  resolveCategoryId,

  resolveSkillLevelId,

  toCategoryUiId,

  toSkillLevelUiId,

} from "@/lib/reference-data/resolve-reference-ids";

import type { ScheduleTimeSlot } from "@/lib/contracts/settings";

import { normalizeLevelId } from "@/lib/server/schedule/schedule-hours-utils";



export type ScheduleSlotRecordInput = {

  id: string;

  startTime: string;

  endTime: string;

  categoryIds?: string[];

  levelIds?: string[];

  /** Legado — um único valor. */

  categoryId?: string | null;

  levelId?: string | null;

};



export function toggleSlotSelectionId(id: string, selected: string[]): string[] {

  if (selected.includes(id)) {

    if (selected.length <= 1) return selected;

    return selected.filter((item) => item !== id);

  }

  return [...selected, id];

}



function categoryIdsEquivalent(a: string, b: string): boolean {

  return a === b || resolveCategoryId(a) === resolveCategoryId(b);

}



function levelIdsEquivalent(a: string, b: string): boolean {

  return a === b || resolveSkillLevelId(a) === resolveSkillLevelId(b);

}



function categoryIdsForUi(ids: string[]): string[] {

  return ids.map((id) => (isReferenceUuid(id) ? id : toCategoryUiId(id)));

}



function levelIdsForUi(ids: string[]): string[] {

  return ids.map((id) => (isReferenceUuid(id) ? id : toSkillLevelUiId(id)));

}



export function resolveScheduleCategoryName(categoryId: string): string {

  const def = REFERENCE_CATEGORY_DEFS.find(

    (c) =>

      c.id === categoryId ||

      c.slug === categoryId ||

      c.slug === toCategoryUiId(categoryId),

  );

  return def?.name ?? categoryId;

}



export function resolveScheduleLevelName(levelId: string): string {

  const def = REFERENCE_SKILL_LEVEL_DEFS.find(

    (l) =>

      l.id === levelId ||

      l.slug === normalizeLevelId(levelId) ||

      l.slug === normalizeLevelId(toSkillLevelUiId(levelId)),

  );

  return def?.name ?? levelId;

}



export function formatScheduleCategoryLabels(
  categoryIds: string[],
  kartCategories: { id: string; name: string }[],
): string {
  if (categoryIds.length === 0) return "—";

  const seen = new Set<string>();
  const labels: string[] = [];

  for (const id of categoryIds) {
    const key = resolveCategoryId(id);
    if (seen.has(key)) continue;
    seen.add(key);

    const fromCatalog = kartCategories.find((c) =>
      categoryIdsEquivalent(c.id, id),
    );
    labels.push(fromCatalog?.name ?? resolveScheduleCategoryName(id));
  }

  return labels.join(", ");
}



export function formatScheduleLevelLabels(
  levelIds: string[],
  skillLevels: { id: string; name: string }[],
): string {
  if (levelIds.length === 0) return "—";

  const seen = new Set<string>();
  const labels: string[] = [];

  for (const id of levelIds) {
    const key = resolveSkillLevelId(normalizeLevelId(id));
    if (seen.has(key)) continue;
    seen.add(key);

    const fromCatalog = skillLevels.find((l) => levelIdsEquivalent(l.id, id));
    labels.push(fromCatalog?.name ?? resolveScheduleLevelName(id));
  }

  return labels.join(", ");
}



function normalizeSlotCategoryIds(

  categoryIds: string[],

  kartCategories: { id: string }[],

): string[] {

  const normalized = categoryIds

    .map(

      (id) =>

        kartCategories.find((c) => categoryIdsEquivalent(c.id, id))?.id,

    )

    .filter((id): id is string => Boolean(id));



  return [...new Set(normalized)];

}



function normalizeSlotLevelIds(

  levelIds: string[],

  skillLevels: { id: string }[],

): string[] {

  const normalized = levelIds

    .map(

      (id) =>

        skillLevels.find((l) => levelIdsEquivalent(l.id, id))?.id,

    )

    .filter((id): id is string => Boolean(id));



  return [...new Set(normalized)];

}



export function syncSlotCategoryAndLevelIds(

  slots: ScheduleTimeSlot[],

  kartCategories: { id: string }[],

  skillLevels: { id: string }[],

): ScheduleTimeSlot[] {

  const catFallback = kartCategories[0]?.id;

  const levelFallback = skillLevels[0]?.id;

  if (!catFallback || !levelFallback) return slots;



  return slots.map((slot) => {

    const categoryIds = normalizeSlotCategoryIds(slot.categoryIds, kartCategories);

    const levelIds = normalizeSlotLevelIds(slot.levelIds, skillLevels);



    return {

      ...slot,

      categoryIds: categoryIds.length > 0 ? categoryIds : [catFallback],

      levelIds: levelIds.length > 0 ? levelIds : [levelFallback],

    };

  });

}



export function resolveCategoryIdsForDb(categoryIds: string[]): string[] {

  return categoryIds.map(resolveCategoryId);

}



export function resolveLevelIdsForDb(levelIds: string[]): string[] {

  return levelIds.map((id) => resolveSkillLevelId(normalizeLevelId(id)));

}



export function mapScheduleSlotRecordToUi(

  row: ScheduleSlotRecordInput,

): ScheduleTimeSlot {

  const categoryIds =

    row.categoryIds && row.categoryIds.length > 0

      ? categoryIdsForUi(row.categoryIds)

      : row.categoryId

        ? categoryIdsForUi([row.categoryId])

        : [];



  const levelIds =

    row.levelIds && row.levelIds.length > 0

      ? levelIdsForUi(row.levelIds)

      : row.levelId

        ? levelIdsForUi([row.levelId])

        : [];



  return {

    id: row.id,

    start: row.startTime,

    end: row.endTime,

    categoryIds,

    levelIds,

  };

}



export function slotMatchesCategory(

  slot: ScheduleTimeSlot,

  categoryId: string,

): boolean {

  return slot.categoryIds.some((id) => categoryIdsEquivalent(id, categoryId));

}



export function slotMatchesLevel(

  slot: ScheduleTimeSlot,

  levelId: string,

): boolean {

  return slot.levelIds.some((id) => levelIdsEquivalent(id, levelId));

}



export function slotMatchesAnyCategory(

  slot: ScheduleTimeSlot,

  categoryIds: string[],

): boolean {

  if (categoryIds.length === 0) return true;

  return slot.categoryIds.some((slotId) =>

    categoryIds.some((id) => categoryIdsEquivalent(slotId, id)),

  );

}


