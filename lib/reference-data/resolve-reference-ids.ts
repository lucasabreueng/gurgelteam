import {
  REFERENCE_CATEGORY_DEFS,
  REFERENCE_SKILL_LEVEL_DEFS,
} from "@/lib/reference-data/seed-reference-ids";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const CATEGORY_SLUG_BY_ID = Object.fromEntries(
  REFERENCE_CATEGORY_DEFS.map((item) => [item.id, item.slug]),
) as Record<string, string>;

const CATEGORY_ID_BY_SLUG = Object.fromEntries(
  REFERENCE_CATEGORY_DEFS.map((item) => [item.slug, item.id]),
) as Record<string, string>;

const SKILL_SLUG_BY_ID = Object.fromEntries(
  REFERENCE_SKILL_LEVEL_DEFS.map((item) => [item.id, item.slug]),
) as Record<string, string>;

const SKILL_ID_BY_SLUG = Object.fromEntries(
  REFERENCE_SKILL_LEVEL_DEFS.map((item) => [item.slug, item.id]),
) as Record<string, string>;

export function isReferenceUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

/** Slug mock UI → slug canônico (ex.: mirim-cadete, f400). */
function normalizeCategoryKey(value: string): string {
  return value.trim().toLowerCase();
}

/** Slug mock UI → slug canônico (ex.: lvl-iniciante → iniciante). */
function normalizeSkillLevelKey(value: string): string {
  const trimmed = value.trim().toLowerCase();
  if (trimmed.startsWith("lvl-")) return trimmed.slice(4);
  return trimmed;
}

export function resolveCategoryId(idOrSlug: string): string {
  const key = normalizeCategoryKey(idOrSlug);
  if (isReferenceUuid(key)) return key;
  return CATEGORY_ID_BY_SLUG[key] ?? key;
}

export function resolveSkillLevelId(idOrSlug: string): string {
  const key = normalizeSkillLevelKey(idOrSlug);
  if (isReferenceUuid(key)) return key;
  return SKILL_ID_BY_SLUG[key] ?? key;
}

export function resolveCategoryIds(idsOrSlugs: string[]): string[] {
  return idsOrSlugs.map(resolveCategoryId);
}

export function toCategoryUiId(idOrSlug: string): string {
  if (isReferenceUuid(idOrSlug)) {
    return CATEGORY_SLUG_BY_ID[idOrSlug] ?? idOrSlug;
  }
  return normalizeCategoryKey(idOrSlug);
}

export function toSkillLevelUiId(idOrSlug: string): string {
  if (isReferenceUuid(idOrSlug)) {
    const slug = SKILL_SLUG_BY_ID[idOrSlug];
    return slug ? `lvl-${slug}` : idOrSlug;
  }
  const slug = normalizeSkillLevelKey(idOrSlug);
  return slug.startsWith("lvl-") ? slug : `lvl-${slug}`;
}

export function toCategoryUiIds(idsOrSlugs: string[]): string[] {
  return idsOrSlugs.map(toCategoryUiId);
}
