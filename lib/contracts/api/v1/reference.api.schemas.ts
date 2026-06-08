import { z } from "zod";

import { zUuid } from "../common.schemas";

export const referenceCategorySchema = z.object({
  id: zUuid,
  slug: z.string(),
  name: z.string(),
});

export const referenceSkillLevelSchema = z.object({
  id: zUuid,
  slug: z.string(),
  name: z.string(),
});

export const referenceCatalogSchema = z.object({
  categories: z.array(referenceCategorySchema),
  skillLevels: z.array(referenceSkillLevelSchema),
});

export type ReferenceCatalogDTO = z.infer<typeof referenceCatalogSchema>;
