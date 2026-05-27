import { z } from "zod";

import type { LessonRegistrationQueryDTO } from "./lesson.types";

export const lessonRegistrationQuerySchema: z.ZodSchema<LessonRegistrationQueryDTO> =
  z.object({
    date: z.string().min(1),
    statusFilter: z.union([
      z.literal(""),
      z.literal("pendentes"),
      z.literal("em_andamento"),
      z.literal("concluidas"),
    ]),
    category: z.string(),
    search: z.string(),
  });

