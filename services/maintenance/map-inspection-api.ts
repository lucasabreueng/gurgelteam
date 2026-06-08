import type {
  ChecklistFinalStatus,
  ChecklistHistoryRow,
  CompleteChecklistType,
} from "@/lib/contracts/maintenance/complete-checklist";
import type { SimpleInspectionRow } from "@/lib/contracts/maintenance/complete-checklist";
import { COMPLETE_CHECKLIST_TYPE_LABELS } from "@/lib/contracts/maintenance/complete-checklist";

const COMPLETE_TYPES = new Set(
  Object.keys(COMPLETE_CHECKLIST_TYPE_LABELS) as CompleteChecklistType[],
);

export type MaintenanceInspectionApiRow = {
  id: string;
  kartId: string;
  kartNumber: number;
  maintenanceOrderId: string | null;
  checklistType: string;
  payload: unknown;
  overallStatus: string | null;
  signedBy: string | null;
  createdAt: string;
};

function formatRowDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function summarizePayload(payload: unknown): {
  summary: string;
  hasAttention: boolean;
} {
  if (!payload || typeof payload !== "object") {
    return { summary: "Inspeção registrada", hasAttention: false };
  }
  const p = payload as Record<string, unknown>;

  if (p.items && typeof p.items === "object") {
    const items = p.items as Record<string, string>;
    const values = Object.values(items);
    const critical = values.filter(
      (v) => v === "necessita_manutencao" || v === "reprovado",
    ).length;
    const warn = values.filter((v) => v === "atencao").length;
    if (critical > 0) {
      return {
        summary: `${critical} item(ns) crítico(s)`,
        hasAttention: true,
      };
    }
    if (warn > 0) {
      return { summary: `${warn} em atenção`, hasAttention: true };
    }
    return { summary: "Todos os itens OK", hasAttention: false };
  }

  if (p.evaluations && typeof p.evaluations === "object") {
    const evals = Object.values(
      p.evaluations as Record<string, { rating?: string }>,
    );
    const failed = evals.filter((e) => e.rating === "reprovado").length;
    const attention = evals.filter((e) => e.rating === "atencao").length;
    if (failed > 0) {
      return {
        summary: `${failed} item(ns) reprovado(s)`,
        hasAttention: true,
      };
    }
    if (attention > 0) {
      return { summary: `${attention} em atenção`, hasAttention: true };
    }
    return { summary: "Checklist concluído", hasAttention: false };
  }

  return { summary: "Inspeção registrada", hasAttention: false };
}

function mapOverallToChecklistStatus(
  overall: string | null,
): ChecklistFinalStatus {
  if (overall === "reprovado" || overall === "bloqueado") return "reprovado";
  if (overall === "aprovado_ressalvas" || overall === "atencao") {
    return "aprovado_ressalvas";
  }
  return "aprovado";
}

export function mapInspectionToSimpleRow(
  row: MaintenanceInspectionApiRow,
): SimpleInspectionRow {
  const { summary, hasAttention } = summarizePayload(row.payload);
  return {
    id: row.id,
    date: formatRowDate(row.createdAt),
    kartId: row.kartId,
    kartNumber: row.kartNumber,
    responsibleName: row.signedBy ?? "—",
    summary,
    hasAttention,
  };
}

export function mapInspectionToChecklistHistoryRow(
  row: MaintenanceInspectionApiRow,
): ChecklistHistoryRow | null {
  const type = row.checklistType as CompleteChecklistType;
  if (!COMPLETE_TYPES.has(type)) return null;

  const payload = row.payload as Record<string, unknown> | null;
  const evaluations =
    payload?.evaluations && typeof payload.evaluations === "object"
      ? Object.values(
          payload.evaluations as Record<string, { rating?: string }>,
        )
      : [];
  const failedCount = evaluations.filter((e) => e.rating === "reprovado").length;

  return {
    id: row.id,
    date: formatRowDate(row.createdAt),
    kartId: row.kartId,
    kartNumber: row.kartNumber,
    type,
    responsibleName: row.signedBy ?? "—",
    finalStatus: mapOverallToChecklistStatus(row.overallStatus),
    failedCount,
  };
}

export function isSimpleInspectionRow(row: MaintenanceInspectionApiRow): boolean {
  return row.checklistType === "simple" || !COMPLETE_TYPES.has(row.checklistType as CompleteChecklistType);
}
