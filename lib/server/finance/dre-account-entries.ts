import type { DreAccountEntry, DrePeriodFilter } from "@/lib/admin-dre-mocks";
import { formatBrl } from "@/lib/admin-cash-flow-mocks";
import { prisma } from "@/lib/server/prisma";
import { isoDateFromDbDate } from "@/lib/server/format-money";

function resolvePeriodRange(filter: DrePeriodFilter): {
  from?: string;
  to?: string;
} {
  const ref = new Date();
  const year = ref.getFullYear();
  const month = ref.getMonth();

  switch (filter.key) {
    case "previous-month": {
      const d = new Date(year, month - 1, 1);
      const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      return {
        from: isoDateFromDbDate(d),
        to: isoDateFromDbDate(last),
      };
    }
    case "current-year":
      return {
        from: `${year}-01-01`,
        to: `${year}-12-31`,
      };
    case "custom":
      if (filter.customStart && filter.customEnd) {
        return { from: filter.customStart, to: filter.customEnd };
      }
      return {};
    default: {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0);
      return {
        from: isoDateFromDbDate(start),
        to: isoDateFromDbDate(end),
      };
    }
  }
}

function formatEntryDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export async function buildDreAccountEntries(
  accountId: string,
  filter: DrePeriodFilter,
): Promise<DreAccountEntry[]> {
  if (accountId.startsWith("group-") || accountId.startsWith("subtotal-")) {
    return [];
  }

  const entry = await prisma.dreEntry.findUnique({ where: { id: accountId } });
  if (!entry) return [];

  const range = resolvePeriodRange(filter);
  const entryMonthKey = `${entry.year}-${String(entry.month).padStart(2, "0")}`;
  if (range.from && range.to) {
    const fromKey = range.from.slice(0, 7);
    const toKey = range.to.slice(0, 7);
    if (entryMonthKey < fromKey || entryMonthKey > toKey) return [];
  }

  const amount = entry.amountCents / 100;
  const dateIso = `${entry.year}-${String(entry.month).padStart(2, "0")}-15`;

  return [
    {
      id: entry.id,
      date: formatEntryDate(dateIso),
      dateIso,
      description: entry.accountName,
      amount,
      reference: `${entry.accountCode} — ${formatBrl(amount)}`,
    },
  ];
}
