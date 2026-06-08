import type { PrismaClient } from "@prisma/client";

import {
  REFERENCE_CATEGORY_DEFS,
  REFERENCE_SKILL_LEVEL_DEFS,
} from "../lib/reference-data/seed-reference-ids";

export async function seedReferenceCatalog(prisma: PrismaClient): Promise<void> {
  for (const category of REFERENCE_CATEGORY_DEFS) {
    await prisma.kartCategory.upsert({
      where: { id: category.id },
      update: {
        slug: category.slug,
        name: category.name,
        sortOrder: category.sortOrder,
      },
      create: {
        id: category.id,
        slug: category.slug,
        name: category.name,
        description: null,
        pricePerLesson: category.slug === "f400" ? 35000 : 30000,
        sortOrder: category.sortOrder,
      },
    });
  }

  for (const level of REFERENCE_SKILL_LEVEL_DEFS) {
    await prisma.skillLevel.upsert({
      where: { id: level.id },
      update: {
        slug: level.slug,
        name: level.name,
        sortOrder: level.sortOrder,
      },
      create: {
        id: level.id,
        slug: level.slug,
        name: level.name,
        sortOrder: level.sortOrder,
        thresholds: {},
      },
    });
  }
}
