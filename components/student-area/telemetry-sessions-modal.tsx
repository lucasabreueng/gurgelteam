"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { HiTrash } from "react-icons/hi2";
import { AppModal } from "@/components/ui/app-modal";
import {
  INNER_TABLE,
  TABLE_HEAD,
} from "@/components/student-area/telemetry/sectors/sectors-styles";
import {
  adminBadgeInfoClass,
  adminTableBodyRowClass,
  adminTableDangerActionButtonClass,
} from "@/lib/design";
import {
  deleteProcessedSession,
  formatLapTime,
  listProcessedSessions,
  type SessionListEntry,
} from "@/lib/telemetry-engine";
import { setStoredTelemetrySessionId } from "@/lib/telemetry-active-session";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { TelemetryRepositoryHttp } from "@/repositories/telemetry/TelemetryRepositoryHttp";
import {
  isApiSessionId,
  toApiSessionStorageId,
} from "@/lib/telemetry-api-session";
import { mapTelemetrySessionToPilotSession } from "@/services/telemetry/map-telemetry-api";

type Props = {
  open: boolean;
  activeSessionId: string;
  onClose: () => void;
  onSelectProcessed?: (sessionId: string) => void;
  onSessionRemoved?: (removedId: string) => void;
};

type SessionRow = {
  id: string;
  dateLabel: string;
  trackName: string;
  totalLaps: number;
  bestLap: string;
  subtitle?: string;
  cloud?: boolean;
};

export function TelemetrySessionsModal({
  open,
  activeSessionId,
  onClose,
  onSelectProcessed,
  onSessionRemoved,
}: Props) {
  const [processed, setProcessed] = useState<SessionListEntry[]>([]);
  const [cloudRows, setCloudRows] = useState<SessionRow[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const httpMode = getDataSourceMode() === "http";

  const reloadSessions = useCallback(async () => {
    const local = await listProcessedSessions();
    setProcessed(local);

    if (!httpMode) {
      setCloudRows([]);
      return;
    }

    try {
      const apiSessions = await TelemetryRepositoryHttp.listSessions();
      setCloudRows(
        apiSessions.map((s) => {
          const pilot = mapTelemetrySessionToPilotSession(s);
          return {
            id: toApiSessionStorageId(s.id),
            dateLabel: pilot.dateLabel,
            trackName: pilot.trackName,
            totalLaps: pilot.totalLaps,
            bestLap: pilot.bestLap,
            subtitle: s.sourceFileName ?? s.source,
            cloud: true,
          };
        }),
      );
    } catch {
      setCloudRows([]);
    }
  }, [httpMode]);

  useEffect(() => {
    if (!open) return;
    void reloadSessions();
  }, [open, activeSessionId, reloadSessions]);

  const rows = useMemo<SessionRow[]>(() => {
    const local: SessionRow[] = processed.map((s) => ({
      id: s.id,
      dateLabel: s.dateLabel,
      trackName: s.trackName,
      totalLaps: s.validLapCount,
      bestLap: s.bestLapTime != null ? formatLapTime(s.bestLapTime) : "—",
      subtitle: s.sourceFileName,
      cloud: false,
    }));
    const cloudIds = new Set(cloudRows.map((r) => r.id));
    const localOnly = local.filter((r) => !cloudIds.has(r.id));
    return [...cloudRows, ...localOnly];
  }, [processed, cloudRows]);

  const handleSelect = (row: SessionRow) => {
    setStoredTelemetrySessionId(row.id);
    onSelectProcessed?.(row.id);
    onClose();
  };

  const handleRemove = async (row: SessionRow) => {
    if (row.cloud || isApiSessionId(row.id)) return;

    const ok = window.confirm(
      `Remover a sessão de ${row.dateLabel} (${row.trackName})? Esta ação não pode ser desfeita.`,
    );
    if (!ok) return;

    setRemovingId(row.id);
    try {
      await deleteProcessedSession(row.id);
      setProcessed((prev) => prev.filter((s) => s.id !== row.id));
      onSessionRemoved?.(row.id);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Sessões do piloto"
      description="Clique na sessão para abrir. Sessões na nuvem vêm do servidor; importações locais podem ser excluídas."
      maxWidth="2xl"
    >
      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-[var(--ds-text-muted)]">
          Nenhuma sessão disponível. Use &quot;Carregar telemetria&quot; para
          importar um arquivo ou aguarde sincronização com o servidor.
        </p>
      ) : (
        <div className={INNER_TABLE}>
          <SessionsTable
            rows={rows}
            activeSessionId={activeSessionId}
            removingId={removingId}
            onSelect={handleSelect}
            onRemove={handleRemove}
          />
        </div>
      )}
    </AppModal>
  );
}

function SessionsTable({
  rows,
  activeSessionId,
  removingId,
  onSelect,
  onRemove,
}: {
  rows: SessionRow[];
  activeSessionId: string;
  removingId: string | null;
  onSelect: (row: SessionRow) => void;
  onRemove: (row: SessionRow) => void;
}) {
  return (
    <div>
      <table className="hidden w-full border-collapse text-[13px] lg:table">
        <thead>
          <tr className={TABLE_HEAD}>
            <th className="px-4 py-3 text-left">Sessão</th>
            <th className="px-4 py-3 text-center">Voltas</th>
            <th className="px-4 py-3 text-right">Melhor volta</th>
            <th className="w-12 px-2 py-3" aria-label="Ações" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const active = row.id === activeSessionId;
            const isRemoving = removingId === row.id;
            return (
              <tr
                key={row.id}
                className={`${adminTableBodyRowClass} ${
                  active ? "bg-accent/5" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelect(row)}
                    className="w-full text-left transition hover:opacity-90"
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[var(--ds-text-primary)]">
                        {row.dateLabel}
                      </span>
                      {row.cloud ? (
                        <span
                          className={`inline-flex rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ring-1 ${adminBadgeInfoClass}`}
                        >
                          Nuvem
                        </span>
                      ) : null}
                      {active ? (
                        <span className="rounded-md bg-accent/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent">
                          Ativa
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-[var(--ds-text-secondary)]">
                      {row.trackName}
                    </span>
                    {row.subtitle ? (
                      <span className="mt-0.5 block truncate text-[11px] text-[var(--ds-text-muted)]">
                        {row.subtitle}
                      </span>
                    ) : null}
                  </button>
                </td>
                <td className="px-4 py-3 text-center font-mono tabular-nums text-[var(--ds-text-secondary)]">
                  {row.totalLaps}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-[var(--ds-success-text)]">
                  {row.bestLap}
                </td>
                <td className="px-2 py-3 text-right">
                  {!row.cloud ? (
                    <button
                      type="button"
                      title="Remover sessão"
                      aria-label="Remover sessão"
                      disabled={isRemoving}
                      onClick={(e) => {
                        e.stopPropagation();
                        void onRemove(row);
                      }}
                      className={`${adminTableDangerActionButtonClass} inline-flex h-8 w-8`}
                    >
                      <HiTrash className="h-4 w-4" />
                    </button>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="lg:hidden">
        <ul className="space-y-2">
          {rows.map((row) => {
            const active = row.id === activeSessionId;
            const isRemoving = removingId === row.id;
            return (
              <li key={row.id}>
                <article
                  className={`rounded-xl border border-[var(--ds-border)] p-3 ${
                    active ? "bg-accent/5" : "bg-[var(--ds-bg-card)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onSelect(row)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-[var(--ds-text-primary)]">
                          {row.dateLabel}
                        </span>
                        {row.cloud ? (
                          <span
                            className={`inline-flex rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ring-1 ${adminBadgeInfoClass}`}
                          >
                            Nuvem
                          </span>
                        ) : null}
                        {active ? (
                          <span className="rounded-md bg-accent/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent">
                            Ativa
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-[12px] text-[var(--ds-text-secondary)]">
                        {row.trackName}
                      </p>
                      {row.subtitle ? (
                        <p className="mt-0.5 truncate text-[11px] text-[var(--ds-text-muted)]">
                          {row.subtitle}
                        </p>
                      ) : null}
                      <p className="mt-1 text-[11px] text-[var(--ds-text-secondary)]">
                        <span className="font-semibold text-[var(--ds-text-primary)]">
                          {row.totalLaps} voltas
                        </span>
                        <span className="mx-1.5 text-[var(--ds-text-muted)]">·</span>
                        <span className="font-mono font-bold tabular-nums text-[var(--ds-success-text)]">
                          {row.bestLap}
                        </span>
                      </p>
                    </button>

                    {!row.cloud ? (
                      <button
                        type="button"
                        title="Remover sessão"
                        aria-label="Remover sessão"
                        disabled={isRemoving}
                        onClick={(e) => {
                          e.stopPropagation();
                          void onRemove(row);
                        }}
                        className={`${adminTableDangerActionButtonClass} inline-flex h-10 w-10 shrink-0 rounded-xl border border-[var(--ds-border-field)]`}
                      >
                        <HiTrash className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
