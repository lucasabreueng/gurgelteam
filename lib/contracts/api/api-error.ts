import { z } from "zod";

export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
  httpStatus?: number;
};

export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
  httpStatus: z.number().int().optional(),
});

