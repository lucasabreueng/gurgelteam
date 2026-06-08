import { prisma } from "@/lib/server/prisma";

export const referenceRepository = {
  async getCatalog() {
    const [categories, skillLevels] = await Promise.all([
      prisma.kartCategory.findMany({
        orderBy: { sortOrder: "asc" },
        select: { id: true, slug: true, name: true },
      }),
      prisma.skillLevel.findMany({
        orderBy: { sortOrder: "asc" },
        select: { id: true, slug: true, name: true },
      }),
    ]);

    return { categories, skillLevels };
  },
};
