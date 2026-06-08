import type { Prisma } from "@prisma/client";

import type { SettingsCatalogApiDTO } from "@/lib/contracts/api/v1/settings.api.schemas";
import { prisma } from "@/lib/server/prisma";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function slugFromName(name: string): string {
  const base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || "categoria";
}

async function uniqueSlug(
  tx: Prisma.TransactionClient,
  base: string,
  excludeId?: string,
): Promise<string> {
  let candidate = base;
  let n = 0;
  while (true) {
    const existing = await tx.kartCategory.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    if (!existing) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}

export const settingsCatalogRepository = {
  async getCatalog(): Promise<SettingsCatalogApiDTO> {
    const [categories, skillLevels] = await Promise.all([
      prisma.kartCategory.findMany({
        where: { active: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.skillLevel.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    const categoryRows = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      pricePerLessonCents: c.pricePerLesson,
      includedItems: c.includedItems,
      sortOrder: c.sortOrder,
    }));

    const levels = skillLevels.map((level) => {
      const thresholds =
        level.thresholds && typeof level.thresholds === "object"
          ? (level.thresholds as Record<string, number>)
          : {};

      const categoryRequirements = categories.map((cat) => ({
        categoryId: cat.id,
        timeHundredths:
          thresholds[cat.slug] ??
          thresholds[cat.id] ??
          0,
      }));

      return {
        id: level.id,
        name: level.name,
        categoryRequirements,
      };
    });

    return { categories: categoryRows, skillLevels: levels };
  },

  async replaceCatalog(payload: SettingsCatalogApiDTO): Promise<SettingsCatalogApiDTO> {
    await prisma.$transaction(
      async (tx) => {
      const existingCategories = await tx.kartCategory.findMany();

      for (let i = 0; i < payload.categories.length; i += 1) {
        const cat = payload.categories[i]!;
        const isUuid = UUID_RE.test(cat.id);
        const baseSlug = cat.slug?.trim() || slugFromName(cat.name);
        const slug = isUuid
          ? await uniqueSlug(tx, baseSlug, cat.id)
          : await uniqueSlug(tx, baseSlug);

        if (isUuid) {
          await tx.kartCategory.update({
            where: { id: cat.id },
            data: {
              name: cat.name,
              slug,
              description: cat.description ?? null,
              includedItems: cat.includedItems ?? null,
              pricePerLesson: cat.pricePerLessonCents,
              sortOrder: cat.sortOrder ?? i,
              active: cat.active ?? true,
            },
          });
        } else {
          await tx.kartCategory.create({
            data: {
              name: cat.name,
              slug,
              description: cat.description ?? null,
              includedItems: cat.includedItems ?? null,
              pricePerLesson: cat.pricePerLessonCents,
              sortOrder: cat.sortOrder ?? i,
              active: true,
            },
          });
        }
      }

      const payloadIds = new Set(
        payload.categories.filter((c) => UUID_RE.test(c.id)).map((c) => c.id),
      );
      for (const row of existingCategories) {
        if (!payloadIds.has(row.id)) {
          await tx.kartCategory.update({
            where: { id: row.id },
            data: { active: false },
          });
        }
      }

      const allCategories = await tx.kartCategory.findMany({
        where: { active: true },
      });
      const idByPayloadId = new Map<string, string>();
      for (const cat of payload.categories) {
        if (UUID_RE.test(cat.id)) {
          idByPayloadId.set(cat.id, cat.id);
        }
      }
      for (const cat of allCategories) {
        const match = payload.categories.find(
          (p) =>
            (UUID_RE.test(p.id) && p.id === cat.id) ||
            slugFromName(p.name) === cat.slug ||
            p.name === cat.name,
        );
        if (match && !UUID_RE.test(match.id)) {
          idByPayloadId.set(match.id, cat.id);
        }
      }

      const existingLevels = await tx.skillLevel.findMany();
      const keptLevelIds = new Set<string>();

      for (let i = 0; i < payload.skillLevels.length; i += 1) {
        const level = payload.skillLevels[i]!;
        const thresholds: Record<string, number> = {};
        for (const req of level.categoryRequirements) {
          const catRow = allCategories.find(
            (c) => c.id === req.categoryId || idByPayloadId.get(req.categoryId) === c.id,
          );
          if (catRow && req.timeHundredths > 0) {
            thresholds[catRow.slug] = req.timeHundredths;
          }
        }

        const isUuid = UUID_RE.test(level.id);
        const existingLevel = isUuid
          ? existingLevels.find((row) => row.id === level.id)
          : undefined;
        const slug =
          existingLevel?.slug ?? slugFromName(level.name);

        if (isUuid) {
          await tx.skillLevel.update({
            where: { id: level.id },
            data: {
              name: level.name,
              thresholds: thresholds as Prisma.InputJsonValue,
              sortOrder: i + 1,
            },
          });
          keptLevelIds.add(level.id);
        } else {
          const created = await tx.skillLevel.create({
            data: {
              slug: await uniqueLevelSlug(tx, slug),
              name: level.name,
              thresholds: thresholds as Prisma.InputJsonValue,
              sortOrder: i + 1,
            },
          });
          keptLevelIds.add(created.id);
        }
      }

      const removableLevelIds = existingLevels
        .filter((row) => !keptLevelIds.has(row.id))
        .map((row) => row.id);

      if (removableLevelIds.length > 0) {
        const levelsInUse = await tx.client.findMany({
          where: { skillLevelId: { in: removableLevelIds } },
          select: { skillLevelId: true },
          distinct: ["skillLevelId"],
        });
        const inUseIds = new Set(
          levelsInUse
            .map((row) => row.skillLevelId)
            .filter((id): id is string => id != null),
        );

        const deletableIds = removableLevelIds.filter((id) => !inUseIds.has(id));
        if (deletableIds.length > 0) {
          await tx.skillLevel.deleteMany({
            where: { id: { in: deletableIds } },
          });
        }
      }
    },
      { maxWait: 10_000, timeout: 30_000 },
    );

    return this.getCatalog();
  },
};

async function uniqueLevelSlug(
  tx: Prisma.TransactionClient,
  base: string,
): Promise<string> {
  let candidate = base;
  let n = 0;
  while (true) {
    const existing = await tx.skillLevel.findFirst({
      where: { slug: candidate },
    });
    if (!existing) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}
