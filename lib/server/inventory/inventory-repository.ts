import type {
  CreateStockMovementRequest,
  InventoryPartApiDTO,
  SupplierApiDTO,
} from "@/lib/contracts/api/v1/inventory.api.schemas";
import { prisma } from "@/lib/server/prisma";
import {
  mapMovementToApi,
  mapPartToApi,
  mapSupplierToApi,
} from "@/lib/server/inventory/map-inventory";
import { formatCentsBrl } from "@/lib/server/format-money";
import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";

export class InventoryApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly httpStatus: number,
  ) {
    super(message);
    this.name = "InventoryApiError";
  }
}

export function isInventoryApiError(error: unknown): error is InventoryApiError {
  return error instanceof InventoryApiError;
}

async function nextPartCode(category: string): Promise<string> {
  const prefixMap: Record<string, string> = {
    Motor: "MOT",
    Pneus: "PNM",
    Freio: "FRN",
    Transmissão: "TRN",
    Combustível: "CBT",
    Segurança: "SEG",
    Ferramentas: "FER",
    Elétrica: "ELT",
  };
  const prefix = prefixMap[category] ?? "PEC";
  const existing = await prisma.inventoryPart.findMany({
    where: { code: { startsWith: `${prefix}-` } },
    select: { code: true },
  });
  const maxSeq = existing.reduce((max, row) => {
    const match = row.code.match(new RegExp(`^${prefix}-(\\d+)$`));
    if (!match) return max;
    return Math.max(max, Number(match[1]));
  }, 0);
  return `${prefix}-${String(maxSeq + 1).padStart(3, "0")}`;
}

async function nextSupplierCode(name: string): Promise<string> {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words
    .map((w) => w.replace(/[^a-zA-Z0-9]/g, "").charAt(0))
    .join("")
    .toUpperCase();
  const base = (letters.length >= 3
    ? letters.slice(0, 3)
    : name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 3)
  ).padEnd(3, "X");

  let code = `FOR-${base}`;
  let suffix = 1;
  while (await prisma.supplier.findUnique({ where: { code } })) {
    code = `FOR-${base.slice(0, 2)}${suffix}`;
    suffix += 1;
  }
  return code;
}

export const inventoryRepository = {
  async listParts() {
    const rows = await prisma.inventoryPart.findMany({
      include: { supplier: { select: { name: true } } },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    return rows.map(mapPartToApi);
  },

  async listSuppliers() {
    const rows = await prisma.supplier.findMany({
      orderBy: { name: "asc" },
    });
    return rows.map(mapSupplierToApi);
  },

  async listMovements(limit = 50) {
    const rows = await prisma.stockMovement.findMany({
      include: {
        part: { select: { code: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows.map(mapMovementToApi);
  },

  async getStats() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [parts, usedToday, pendingPurchases, lastMovement] = await Promise.all([
      prisma.inventoryPart.findMany({
        include: { supplier: { select: { name: true } } },
      }),
      prisma.stockMovement.count({
        where: {
          createdAt: { gte: todayStart },
          type: { in: ["saida", "perda"] },
        },
      }),
      prisma.purchaseOrder.count({
        where: { status: { in: ["solicitado", "aprovado", "comprado"] } },
      }),
      prisma.stockMovement.findFirst({
        orderBy: { createdAt: "desc" },
        include: { part: { select: { name: true } } },
      }),
    ]);

    const lowStock = parts.filter((p) => p.stockQty < p.minStockQty).length;
    const critical = parts.filter(
      (p) => p.stockQty <= 0 || p.stockQty < p.minStockQty * 0.5,
    ).length;
    const totalValueCents = parts.reduce(
      (sum, p) => sum + p.stockQty * p.unitCostCents,
      0,
    );

    const lastMovementLabel = lastMovement
      ? `${lastMovement.createdAt.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
        })} · ${lastMovement.type === "entrada" ? "Entrada" : "Saída"}`
      : "—";

    return {
      totalParts: parts.length,
      lowStock,
      critical,
      totalValueCents,
      formattedTotalValue: formatCentsBrl(totalValueCents),
      usedToday,
      pendingPurchases,
      lastMovementLabel,
    };
  },

  async createMovement(data: CreateStockMovementRequest) {
    const part = await prisma.inventoryPart.findUnique({
      where: { id: data.inventoryPartId },
    });
    if (!part) throw new Error("Peça não encontrada.");

    const delta =
      data.type === "entrada" || data.type === "devolucao"
        ? data.qty
        : -data.qty;

    const [movement] = await prisma.$transaction([
      prisma.stockMovement.create({
        data: {
          inventoryPartId: data.inventoryPartId,
          type: data.type,
          qty: data.qty,
          kartId: data.kartId ?? null,
          maintenanceId: data.maintenanceId ?? null,
          notes: data.notes ?? null,
        },
        include: { part: { select: { code: true, name: true } } },
      }),
      prisma.inventoryPart.update({
        where: { id: data.inventoryPartId },
        data: { stockQty: { increment: delta } },
      }),
    ]);

    return mapMovementToApi(movement);
  },

  async getPartById(id: string): Promise<InventoryPartApiDTO | null> {
    const row = await prisma.inventoryPart.findUnique({
      where: { id },
      include: { supplier: { select: { name: true } } },
    });
    return row ? mapPartToApi(row) : null;
  },

  async createPart(
    data: {
      code?: string;
      name: string;
      category: string;
      stockQty: number;
      minStockQty: number;
      unitCostCents: number;
      supplierId: string;
    },
  ): Promise<InventoryPartApiDTO> {
    const code = data.code || (await nextPartCode(data.category));
    const row = await prisma.inventoryPart.create({
      data: {
        code,
        name: data.name,
        category: data.category,
        stockQty: data.stockQty,
        minStockQty: data.minStockQty,
        unitCostCents: data.unitCostCents,
        supplierId: data.supplierId,
      },
      include: { supplier: { select: { name: true } } },
    });
    return mapPartToApi(row);
  },

  async updatePart(
    id: string,
    data: Partial<Omit<InventoryPartApiDTO, "id" | "supplierName">>,
  ): Promise<InventoryPartApiDTO> {
    const row = await prisma.inventoryPart.update({
      where: { id },
      data: {
        ...(data.code !== undefined ? { code: data.code } : {}),
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.stockQty !== undefined ? { stockQty: data.stockQty } : {}),
        ...(data.minStockQty !== undefined
          ? { minStockQty: data.minStockQty }
          : {}),
        ...(data.unitCostCents !== undefined
          ? { unitCostCents: data.unitCostCents }
          : {}),
        ...(data.supplierId !== undefined
          ? { supplierId: data.supplierId }
          : {}),
      },
      include: { supplier: { select: { name: true } } },
    });
    return mapPartToApi(row);
  },

  async deletePart(id: string): Promise<void> {
    const usage = await prisma.stockMovement.count({
      where: { inventoryPartId: id },
    });
    if (usage > 0) {
      throw new InventoryApiError(
        API_ERROR_CODES.CONFLICT,
        "Peça com movimentações não pode ser excluída.",
        409,
      );
    }
    await prisma.inventoryPart.delete({ where: { id } });
  },

  async getSupplierById(id: string): Promise<SupplierApiDTO | null> {
    const row = await prisma.supplier.findUnique({ where: { id } });
    return row ? mapSupplierToApi(row) : null;
  },

  async createSupplier(data: {
    code?: string;
    name: string;
    cnpj?: string | null;
    city?: string | null;
    phone?: string | null;
    email?: string | null;
    status?: SupplierApiDTO["status"];
    avgLeadDays?: number | null;
  }): Promise<SupplierApiDTO> {
    const code = data.code || (await nextSupplierCode(data.name));
    const row = await prisma.supplier.create({
      data: {
        code,
        name: data.name,
        cnpj: data.cnpj ?? null,
        city: data.city ?? null,
        phone: data.phone ?? null,
        email: data.email ?? null,
        active: (data.status ?? "ativo") !== "inativo",
        avgLeadDays: data.avgLeadDays ?? null,
      },
    });
    return mapSupplierToApi(row);
  },

  async updateSupplier(
    id: string,
    data: Partial<Omit<SupplierApiDTO, "id" | "code">>,
  ): Promise<SupplierApiDTO> {
    const row = await prisma.supplier.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.cnpj !== undefined ? { cnpj: data.cnpj } : {}),
        ...(data.city !== undefined ? { city: data.city } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.email !== undefined ? { email: data.email } : {}),
        ...(data.status !== undefined
          ? { active: data.status !== "inativo" }
          : {}),
        ...(data.avgLeadDays !== undefined
          ? { avgLeadDays: data.avgLeadDays }
          : {}),
      },
    });
    return mapSupplierToApi(row);
  },

  async deleteSupplier(id: string): Promise<void> {
    const partsCount = await prisma.inventoryPart.count({
      where: { supplierId: id },
    });
    if (partsCount > 0) {
      throw new InventoryApiError(
        API_ERROR_CODES.CONFLICT,
        "Fornecedor com peças vinculadas não pode ser excluído.",
        409,
      );
    }
    await prisma.supplier.delete({ where: { id } });
  },

  async listPurchaseOrders() {
    const rows = await prisma.purchaseOrder.findMany({
      include: {
        supplier: { select: { id: true, name: true } },
        lines: {
          include: { part: { select: { code: true, name: true, unitCostCents: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return rows.flatMap((order) =>
      order.lines.map((line) => ({
        id: `${order.id}-${line.id}`,
        orderId: order.id,
        partName: line.part.name,
        partCode: line.part.code,
        supplierId: order.supplierId,
        supplierName: order.supplier.name,
        quantity: line.qty,
        value: line.qty * line.unitCostCents,
        forecast: order.createdAt.toLocaleDateString("pt-BR", {
          timeZone: "America/Sao_Paulo",
          day: "2-digit",
          month: "short",
        }),
        status: order.status,
        requestedBy: "Equipe",
      })),
    );
  },

  async createPurchaseOrder(data: {
    supplierId: string;
    inventoryPartId: string;
    qty: number;
    unitCostCents?: number;
  }) {
    const part = await prisma.inventoryPart.findUnique({
      where: { id: data.inventoryPartId },
    });
    if (!part) throw new InventoryApiError(API_ERROR_CODES.NOT_FOUND, "Peça não encontrada.", 404);

    const order = await prisma.purchaseOrder.create({
      data: {
        supplierId: data.supplierId,
        status: "solicitado",
        lines: {
          create: {
            inventoryPartId: data.inventoryPartId,
            qty: data.qty,
            unitCostCents: data.unitCostCents ?? part.unitCostCents,
          },
        },
      },
      include: {
        supplier: { select: { name: true } },
        lines: { include: { part: { select: { code: true, name: true } } } },
      },
    });

    const line = order.lines[0]!;
    return {
      id: `${order.id}-${line.id}`,
      orderId: order.id,
      partName: line.part.name,
      partCode: line.part.code,
      supplierId: order.supplierId,
      supplierName: order.supplier.name,
      quantity: line.qty,
      value: line.qty * line.unitCostCents,
      forecast: "—",
      status: order.status,
      requestedBy: "Equipe",
    };
  },

  async listHistory(limit = 50) {
    const movements = await this.listMovements(limit);
    return movements.map((m) => ({
      id: m.id,
      type: "movement" as const,
      label: `${m.partName} (${m.partCode})`,
      detail: `${m.type} · ${m.qty} un.`,
      at: m.createdAt,
    }));
  },
};
