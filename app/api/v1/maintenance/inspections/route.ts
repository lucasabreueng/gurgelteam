import type { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { z } from "zod";

import { maintenanceInspectionRepository } from "@/lib/server/maintenance/maintenance-inspection-repository";
import {
  isNextResponse,
  parseJsonBody,
  parseSearchParams,
  requireModulePermission,
} from "@/lib/server/api/require-auth";
import {
  internalError,
  jsonError,
  jsonSuccess,
} from "@/lib/server/api/responses";
import { zUuid } from "@/lib/contracts/api/common.schemas";

export const dynamic = "force-dynamic";

const inspectionsQuerySchema = z.object({
  kartId: zUuid.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

const createInspectionSchema = z.object({
  kartId: zUuid,
  maintenanceOrderId: zUuid.optional(),
  checklistType: z.string().default("pre"),
  payload: z.unknown(),
  overallStatus: z.string().optional(),
  signedBy: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const auth = await requireModulePermission(request, "manutencao", "view");
  if (isNextResponse(auth)) return auth;

  const query = parseSearchParams(request, inspectionsQuerySchema);
  if (isNextResponse(query)) return query;

  try {
    const data = await maintenanceInspectionRepository.list(query);
    return jsonSuccess(data);
  } catch (error) {
    console.error("[maintenance/inspections GET]", error);
    return jsonError(internalError());
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireModulePermission(request, "manutencao", "edit");
  if (isNextResponse(auth)) return auth;

  const body = await parseJsonBody(request, createInspectionSchema);
  if (isNextResponse(body)) return body;

  try {
    const data = await maintenanceInspectionRepository.create({
      ...body,
      payload: body.payload as Prisma.InputJsonValue,
    });
    return jsonSuccess(data, 201);
  } catch (error) {
    console.error("[maintenance/inspections POST]", error);
    return jsonError(internalError());
  }
}
