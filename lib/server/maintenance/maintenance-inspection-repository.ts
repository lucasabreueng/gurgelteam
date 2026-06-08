import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/server/prisma";

export const maintenanceInspectionRepository = {
  async list(params?: { kartId?: string; limit?: number }) {
    const rows = await prisma.maintenanceInspection.findMany({
      where: params?.kartId ? { kartId: params.kartId } : {},
      include: { kart: { select: { number: true } } },
      orderBy: { createdAt: "desc" },
      take: params?.limit ?? 50,
    });
    return rows.map((row) => ({
      id: row.id,
      kartId: row.kartId,
      kartNumber: row.kart.number,
      maintenanceOrderId: row.maintenanceOrderId,
      checklistType: row.checklistType,
      payload: row.payload,
      overallStatus: row.overallStatus,
      signedBy: row.signedBy,
      createdAt: row.createdAt.toISOString(),
    }));
  },

  async create(data: {
    kartId: string;
    maintenanceOrderId?: string;
    checklistType?: string;
    payload: Prisma.InputJsonValue;
    overallStatus?: string;
    signedBy?: string;
  }) {
    const row = await prisma.maintenanceInspection.create({
      data: {
        kartId: data.kartId,
        maintenanceOrderId: data.maintenanceOrderId ?? null,
        checklistType: data.checklistType ?? "pre",
        payload: data.payload,
        overallStatus: data.overallStatus ?? null,
        signedBy: data.signedBy ?? null,
      },
      include: { kart: { select: { number: true } } },
    });
    return {
      id: row.id,
      kartId: row.kartId,
      kartNumber: row.kart.number,
      maintenanceOrderId: row.maintenanceOrderId,
      checklistType: row.checklistType,
      payload: row.payload,
      overallStatus: row.overallStatus,
      signedBy: row.signedBy,
      createdAt: row.createdAt.toISOString(),
    };
  },
};
