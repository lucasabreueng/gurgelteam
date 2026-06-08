import { z } from "zod";

import { zRoleKey } from "./auth.api.schemas";
import { zUuid } from "../common.schemas";

export const teamMemberSchema = z.object({
  id: zUuid,
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
  roleKey: zRoleKey,
  permissionProfileId: z.string().nullable().optional(),
  roleLabel: z.string(),
  active: z.boolean(),
  createdAtLabel: z.string(),
  avatar: z.string().nullable(),
});

export type TeamMemberApiDTO = z.infer<typeof teamMemberSchema>;

export const teamQuerySchema = z.object({
  query: z.string().default(""),
  roleKey: zRoleKey.or(z.literal("")).default(""),
  permissionProfileId: z.string().default(""),
  status: z.enum(["", "ativo", "inativo"]).default(""),
});

export type TeamQuery = z.infer<typeof teamQuerySchema>;

export const createTeamMemberSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  username: z.string().min(3),
  permissionProfileId: z.string().min(1),
  active: z.boolean().default(true),
});

export const updateTeamMemberSchema = z.object({
  permissionProfileId: z.string().min(1),
});

export type CreateTeamMemberRequest = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMemberRequest = z.infer<typeof updateTeamMemberSchema>;
