import {
  CHECKLIST_FINAL_STATUS_LABELS,
  COMPLETE_CHECKLIST_TYPE_LABELS,
  type CompleteChecklistType,
  type KartTechnicalTimelineEntry,
} from "@/lib/contracts/maintenance/complete-checklist";
import { maintenanceInspectionRepository } from "@/lib/server/maintenance/maintenance-inspection-repository";
import { prisma } from "@/lib/server/prisma";

const COMPLETE_TYPES = new Set(
  Object.keys(COMPLETE_CHECKLIST_TYPE_LABELS) as CompleteChecklistType[],
);

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function summarizeInspection(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "Inspeção registrada";
  const p = payload as Record<string, unknown>;
  if (p.diagnosis && typeof p.diagnosis === "string") return p.diagnosis;
  if (p.generalCondition && typeof p.generalCondition === "string") {
    return `Condição: ${p.generalCondition}`;
  }
  return "Inspeção registrada";
}

function checklistDetail(
  payload: unknown,
  failedCount: number,
  finalStatus: keyof typeof CHECKLIST_FINAL_STATUS_LABELS,
): string {
  const statusLabel = CHECKLIST_FINAL_STATUS_LABELS[finalStatus];
  if (failedCount > 0) {
    return `${statusLabel} — ${failedCount} item(ns) reprovado(s)`;
  }
  if (payload && typeof payload === "object") {
    const p = payload as Record<string, unknown>;
    if (p.diagnosis && typeof p.diagnosis === "string") return p.diagnosis;
  }
  return statusLabel;
}

export async function buildKartTechnicalTimeline(
  kartId: string,
): Promise<KartTechnicalTimelineEntry[]> {
  const [inspections, orders] = await Promise.all([
    maintenanceInspectionRepository.list({ kartId, limit: 100 }),
    prisma.maintenanceOrder.findMany({
      where: { kartId },
      orderBy: { detectedAt: "desc" },
      take: 100,
    }),
  ]);

  const entries: (KartTechnicalTimelineEntry & { sortAt: string })[] = [];

  for (const row of inspections) {
    const dateLabel = formatDate(row.createdAt);
    if (
      row.checklistType === "simple" ||
      !COMPLETE_TYPES.has(row.checklistType as CompleteChecklistType)
    ) {
      entries.push({
        id: row.id,
        date: dateLabel,
        dateLabel,
        kind: "inspecao",
        title: "Inspeção",
        detail: summarizeInspection(row.payload),
        sortAt: row.createdAt,
      });
      continue;
    }

    const payload = row.payload as Record<string, unknown> | null;
    const evaluations =
      payload?.evaluations && typeof payload.evaluations === "object"
        ? Object.values(
            payload.evaluations as Record<string, { rating?: string }>,
          )
        : [];
    const failedCount = evaluations.filter((e) => e.rating === "reprovado").length;
    const finalStatus =
      row.overallStatus === "reprovado" || row.overallStatus === "bloqueado"
        ? "reprovado"
        : row.overallStatus === "aprovado_ressalvas" ||
            row.overallStatus === "atencao"
          ? "aprovado_ressalvas"
          : "aprovado";

    entries.push({
      id: row.id,
      date: dateLabel,
      dateLabel,
      kind: "checklist",
      title: "Checklist Completo",
      detail: checklistDetail(row.payload, failedCount, finalStatus),
      sortAt: row.createdAt,
    });
  }

  for (const order of orders) {
    const sortAt = order.detectedAt.toISOString();
    const dateLabel = formatDate(sortAt);
    entries.push({
      id: order.id,
      date: dateLabel,
      dateLabel,
      kind: "manutencao",
      title: "Manutenção",
      detail: order.description ?? order.title,
      sortAt,
    });
  }

  return entries
    .sort(
      (a, b) => new Date(b.sortAt).getTime() - new Date(a.sortAt).getTime(),
    )
    .map(({ sortAt, ...entry }) => {
      void sortAt;
      return entry;
    });
}
