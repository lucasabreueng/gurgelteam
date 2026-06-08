/** UUIDs determinísticos — alinhados ao seed Prisma e ao modo HTTP. */
export const REFERENCE_SEED_IDS = {
  categories: {
    f400: "22222222-2222-4222-8222-222222222201",
    mirimCadete: "22222222-2222-4222-8222-222222222202",
    cc125: "22222222-2222-4222-8222-222222222203",
  },
  skillLevels: {
    iniciante: "11111111-1111-4111-8111-111111111101",
    intermediario: "11111111-1111-4111-8111-111111111102",
    avancado: "11111111-1111-4111-8111-111111111103",
    competidor: "11111111-1111-4111-8111-111111111104",
  },
} as const;

export const REFERENCE_CATEGORY_DEFS = [
  {
    id: REFERENCE_SEED_IDS.categories.mirimCadete,
    slug: "mirim-cadete",
    name: "Mirim / Cadete",
    sortOrder: 0,
  },
  {
    id: REFERENCE_SEED_IDS.categories.f400,
    slug: "f400",
    name: "F400",
    sortOrder: 1,
  },
  {
    id: REFERENCE_SEED_IDS.categories.cc125,
    slug: "125cc",
    name: "125cc",
    sortOrder: 2,
  },
] as const;

export const REFERENCE_SKILL_LEVEL_DEFS = [
  {
    id: REFERENCE_SEED_IDS.skillLevels.iniciante,
    slug: "iniciante",
    name: "Iniciante",
    sortOrder: 1,
  },
  {
    id: REFERENCE_SEED_IDS.skillLevels.intermediario,
    slug: "intermediario",
    name: "Intermediário",
    sortOrder: 2,
  },
  {
    id: REFERENCE_SEED_IDS.skillLevels.avancado,
    slug: "avancado",
    name: "Avançado",
    sortOrder: 3,
  },
  {
    id: REFERENCE_SEED_IDS.skillLevels.competidor,
    slug: "competidor",
    name: "Competidor",
    sortOrder: 4,
  },
] as const;
