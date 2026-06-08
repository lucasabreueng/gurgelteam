import type {
  CreateReceivableRequest,
  PayablesQuery,
  ReceivablesQuery,
} from "@/lib/contracts/api/v1/finance.api.schemas";
import type { RecordPaymentRequest } from "@/lib/contracts/api/v1/finance.api.schemas";
import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";
import type { ApiError } from "@/lib/contracts/api/api-error";
import { prisma } from "@/lib/server/prisma";
import {
  mapPayableToApi,
  mapReceivableToApi,
} from "@/lib/server/finance/map-finance";
import { formatCentsBrl, isoDateFromDbDate } from "@/lib/server/format-money";

function matchesQuery(text: string, query: string): boolean {
  if (!query.trim()) return true;
  return text.toLowerCase().includes(query.trim().toLowerCase());
}

function notFoundReceivable(): ApiError {
  return {
    code: API_ERROR_CODES.NOT_FOUND,
    message: "Conta a receber não encontrada.",
    httpStatus: 404,
  };
}

function notFoundClient(): ApiError {
  return {
    code: API_ERROR_CODES.NOT_FOUND,
    message: "Cliente não encontrado.",
    httpStatus: 404,
  };
}

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value
  );
}

export const financeRepository = {
  async listReceivables(query: ReceivablesQuery) {
    const rows = await prisma.accountReceivable.findMany({
      where: {
        ...(query.clientId ? { clientId: query.clientId } : {}),
        ...(query.status ? { status: query.status } : {}),
        ...(query.from || query.to
          ? {
              dueDate: {
                ...(query.from
                  ? {
                      gte: new Date(`${query.from}T00:00:00.000-03:00`),
                    }
                  : {}),
                ...(query.to
                  ? {
                      lte: new Date(`${query.to}T23:59:59.999-03:00`),
                    }
                  : {}),
              },
            }
          : {}),
      },
      include: { client: { select: { name: true } } },
      orderBy: { dueDate: "asc" },
    });

    return rows
      .map(mapReceivableToApi)
      .filter((row) => {
        if (query.method && row.paymentMethod !== query.method) return false;
        if (query.service && row.serviceLabel !== query.service) return false;
        if (
          !matchesQuery(
            `${row.clientName} ${row.serviceLabel}`,
            query.query,
          )
        ) {
          return false;
        }
        return true;
      });
  },

  async listPayables(query: PayablesQuery) {
    const rows = await prisma.accountPayable.findMany({
      where: {
        ...(query.status ? { status: query.status } : {}),
        ...(query.from || query.to
          ? {
              dueDate: {
                ...(query.from
                  ? {
                      gte: new Date(`${query.from}T00:00:00.000-03:00`),
                    }
                  : {}),
                ...(query.to
                  ? {
                      lte: new Date(`${query.to}T23:59:59.999-03:00`),
                    }
                  : {}),
              },
            }
          : {}),
      },
      orderBy: { dueDate: "asc" },
    });

    return rows
      .map(mapPayableToApi)
      .filter((row) => {
        if (query.method && row.paymentMethod !== query.method) return false;
        if (query.category && row.category !== query.category) return false;
        if (
          !matchesQuery(`${row.supplierName} ${row.category}`, query.query)
        ) {
          return false;
        }
        return true;
      });
  },

  async getOverviewStats() {
    const now = new Date();
    const monthStart = new Date(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01T00:00:00.000-03:00`,
    );

    const [receivables, payables, paidThisMonth] = await Promise.all([
      prisma.accountReceivable.findMany({
        include: { client: { select: { name: true } } },
      }),
      prisma.accountPayable.findMany(),
      prisma.payment.aggregate({
        where: { paidAt: { gte: monthStart } },
        _sum: { amountCents: true },
      }),
    ]);

    const mappedReceivables = receivables.map(mapReceivableToApi);
    const openReceivables = mappedReceivables.filter(
      (r) => r.status !== "pago",
    );
    const delinquent = mappedReceivables.filter((r) => r.status === "vencido");
    const openPayables = payables
      .map(mapPayableToApi)
      .filter((p) => p.status !== "pago");

    const receivableTotal = openReceivables.reduce(
      (sum, r) => sum + r.amountCents,
      0,
    );
    const delinquentTotal = delinquent.reduce(
      (sum, r) => sum + r.amountCents,
      0,
    );
    const payableTotal = openPayables.reduce(
      (sum, p) => sum + p.amountCents,
      0,
    );
    const revenueMonth = paidThisMonth._sum.amountCents ?? 0;

    return {
      revenueMonthCents: revenueMonth,
      receivableTotalCents: receivableTotal,
      receivableCount: openReceivables.length,
      delinquentTotalCents: delinquentTotal,
      payableTotalCents: payableTotal,
      payableCount: openPayables.length,
      formatted: {
        revenueMonth: formatCentsBrl(revenueMonth),
        receivableTotal: formatCentsBrl(receivableTotal),
        delinquentTotal: formatCentsBrl(delinquentTotal),
        payableTotal: formatCentsBrl(payableTotal),
      },
      monthLabel: isoDateFromDbDate(monthStart).slice(0, 7),
    };
  },

  async createReceivable(data: CreateReceivableRequest) {
    const client = await prisma.client.findUnique({
      where: { id: data.clientId },
      select: { id: true, name: true },
    });
    if (!client) throw notFoundClient();

    if (data.scheduleEventId) {
      const event = await prisma.scheduleEvent.findUnique({
        where: { id: data.scheduleEventId },
        select: { id: true },
      });
      if (!event) {
        throw {
          code: API_ERROR_CODES.NOT_FOUND,
          message: "Evento da agenda não encontrado.",
          httpStatus: 404,
        } satisfies ApiError;
      }
    }

    const row = await prisma.accountReceivable.create({
      data: {
        clientId: data.clientId,
        scheduleEventId: data.scheduleEventId ?? null,
        amountCents: data.amountCents,
        dueDate: new Date(`${data.dueDate}T12:00:00.000-03:00`),
        status: "pendente",
        paymentMethod: data.paymentMethod ?? null,
        serviceLabel: data.serviceLabel,
      },
      include: { client: { select: { name: true } } },
    });

    if (data.scheduleEventId) {
      await prisma.scheduleEvent.update({
        where: { id: data.scheduleEventId },
        data: { paymentStatus: "pendente" },
      });
    }

    return mapReceivableToApi(row);
  },

  async recordPayment(data: RecordPaymentRequest, recordedById?: string) {
    const receivable = await prisma.accountReceivable.findUnique({
      where: { id: data.receivableId },
      include: { client: { select: { name: true } } },
    });
    if (!receivable) throw notFoundReceivable();

    const payment = await prisma.payment.create({
      data: {
        receivableId: data.receivableId,
        amountCents: data.amountCents,
        paidAt: new Date(data.paidAt),
        method: data.method,
        recordedById: recordedById ?? null,
      },
    });

    const paidTotal = await prisma.payment.aggregate({
      where: { receivableId: data.receivableId },
      _sum: { amountCents: true },
    });
    const totalPaid = paidTotal._sum.amountCents ?? 0;
    const nextStatus =
      totalPaid >= receivable.amountCents
        ? "pago"
        : totalPaid > 0
          ? "parcial"
          : receivable.status;

    const updated = await prisma.accountReceivable.update({
      where: { id: data.receivableId },
      data: {
        status: nextStatus,
        paymentMethod: data.method,
      },
      include: { client: { select: { name: true } } },
    });

    return {
      paymentId: payment.id,
      receivable: mapReceivableToApi(updated),
    };
  },
};
