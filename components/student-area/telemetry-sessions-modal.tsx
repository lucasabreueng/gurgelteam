"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { HiTrash } from "react-icons/hi2";
import { AppModal } from "@/components/ui/app-modal";
import {
  INNER_TABLE,
  TABLE_HEAD,
} from "@/components/student-area/telemetry/sectors/sectors-styles";
import {
  deleteProcessedSession,
  formatLapTime,
  listProcessedSessions,
  type SessionListEntry,
} from "@/lib/telemetry-engine";
import { setStoredTelemetrySessionId } from "@/lib/telemetry-active-session";

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
};

export function TelemetrySessionsModal({
  open,
  activeSessionId,
  onClose,
  onSelectProcessed,
  onSessionRemoved,
}: Props) {
  const [sessions, setSessions] = useState<SessionListEntry[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const reloadSessions = useCallback(() => {
    void listProcessedSessions().then(setSessions);
  }, []);

  useEffect(() => {
    if (!open) return;
    reloadSessions();
  }, [open, activeSessionId, reloadSessions]);

  const rows = useMemo<SessionRow[]>(
    () =>
      sessions.map((s) => ({
        id: s.id,
        dateLabel: s.dateLabel,
        trackName: s.trackName,
        totalLaps: s.validLapCount,
        bestLap: s.bestLapTime != null ? formatLapTime(s.bestLapTime) : "—",
        subtitle: s.sourceFileName,
      })),
    [sessions],
  );

  const handleSelect = (row: SessionRow) => {
    setStoredTelemetrySessionId(row.id);
    onSelectProcessed?.(row.id);
    onClose();
  };

  const handleRemove = async (row: SessionRow) => {
    const ok = window.confirm(
      `Remover a sessão de ${row.dateLabel} (${row.trackName})? Esta ação não pode ser desfeita.`,
    );
    if (!ok) return;

    setRemovingId(row.id);
    try {
      await deleteProcessedSession(row.id);
      setSessions((prev) => prev.filter((s) => s.id !== row.id));
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
      description="Clique na sessão para abrir. Use o ícone à direita para excluir."
      maxWidth="2xl"
    >
      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-neutral-500">
          Nenhuma sessão importada. Use &quot;Carregar telemetria&quot; para
          adicionar uma sessão.
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
                className={`border-b border-dashed border-neutral-200 transition last:border-0 ${
                  active ? "bg-accent/5" : "hover:bg-white/90"
                }`}
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelect(row)}
                    className="w-full text-left transition hover:opacity-90"
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[#0d1f3c]">
                        {row.dateLabel}
                      </span>
                      {active ? (
                        <span className="rounded-md bg-accent/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent">
                          Ativa
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-neutral-600">
                      {row.trackName}
                    </span>
                    {row.subtitle ? (
                      <span className="mt-0.5 block truncate text-[11px] text-neutral-400">
                        {row.subtitle}
                      </span>
                    ) : null}
                  </button>
                </td>
                <td className="px-4 py-3 text-center font-mono tabular-nums text-neutral-800">
                  {row.totalLaps}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-emerald-700">
                  {row.bestLap}
                </td>
                <td className="px-2 py-3 text-right">
                  <button
                    type="button"
                    title="Remover sessão"
                    aria-label="Remover sessão"
                    disabled={isRemoving}
                    onClick={(e) => {
                      e.stopPropagation();
                      void onRemove(row);
                    }}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <HiTrash className="h-4 w-4" />
                  </button>
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
                  className={`rounded-xl border border-[rgba(17,17,17,0.08)] p-3 ${
                    active ? "bg-accent/5" : "bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onSelect(row)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-[#0d1f3c]">
                          {row.dateLabel}
                        </span>
                        {active ? (
                          <span className="rounded-md bg-accent/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent">
                            Ativa
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-[12px] text-neutral-600">
                        {row.trackName}
                      </p>
                      {row.subtitle ? (
                        <p className="mt-0.5 truncate text-[11px] text-neutral-400">
                          {row.subtitle}
                        </p>
                      ) : null}
                      <p className="mt-1 text-[11px] text-neutral-600">
                        <span className="font-semibold text-[#111]">
                          {row.totalLaps} voltas
                        </span>
                        <span className="mx-1.5 text-neutral-300">·</span>
                        <span className="font-mono font-bold tabular-nums text-emerald-700">
                          {row.bestLap}
                        </span>
                      </p>
                    </button>

                    <button
                      type="button"
                      title="Remover sessão"
                      aria-label="Remover sessão"
                      disabled={isRemoving}
                      onClick={(e) => {
                        e.stopPropagation();
                        void onRemove(row);
                      }}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] text-red-600 disabled:opacity-40"
                    >
                      <HiTrash className="h-4 w-4" />
                    </button>
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
