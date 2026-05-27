"use client";

import {
  computeTotalFromSectors,
  createEmptyLap,
  type LapFieldKey,
  type LapRow,
  type LapValidationIssue,
} from "@/lib/lesson-registration-laps";
import { HiPlus, HiTrash } from "react-icons/hi2";

type Props = {
  rows: LapRow[];
  onChange: (rows: LapRow[]) => void;
  issues?: LapValidationIssue[];
  readOnly?: boolean;
  /** Oculta o botão interno (use ações no rodapé do painel pai). */
  hideAddButton?: boolean;
};

function issueFor(
  issues: LapValidationIssue[],
  lapId: string,
  field?: LapFieldKey,
) {
  return issues.some(
    (i) => i.lapId === lapId && (!field || i.field === field),
  );
}

export function LapsTable({
  rows,
  onChange,
  issues = [],
  readOnly,
  hideAddButton,
}: Props) {
  const updateRow = (id: string, patch: Partial<LapRow>) => {
    onChange(
      rows.map((r) => {
        if (r.id !== id) return r;
        const next = { ...r, ...patch };
        if (patch.s1 !== undefined || patch.s2 !== undefined || patch.s3 !== undefined) {
          const auto = computeTotalFromSectors(next.s1, next.s2, next.s3);
          if (auto) next.total = auto;
        }
        return next;
      }),
    );
  };

  const addRow = () => {
    onChange([...rows, createEmptyLap(rows.length + 1)]);
  };

  const removeRow = (id: string) => {
    if (rows.length <= 1) return;
    onChange(
      rows
        .filter((r) => r.id !== id)
        .map((r, i) => ({ ...r, lap: i + 1 })),
    );
  };

  const cellClass = (lapId: string, field: LapFieldKey) => {
    const bad = issueFor(issues, lapId, field);
    return `w-full min-w-[4.5rem] rounded-lg border px-2 py-1.5 font-mono text-sm tabular-nums outline-none transition ${
      bad
        ? "border-red-300 bg-red-50/80 ring-2 ring-red-200/50"
        : "border-[rgba(17,17,17,0.1)] bg-white focus:border-accent focus:ring-2 focus:ring-accent/15"
    }`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            <th className="px-2 py-2">Volta</th>
            <th className="px-2 py-2">S1</th>
            <th className="px-2 py-2">S2</th>
            <th className="px-2 py-2">S3</th>
            <th className="px-2 py-2">Tempo</th>
            {!readOnly ? <th className="w-10 px-2 py-2" /> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-2 py-1.5 font-bold text-[#0d1f3c]">{row.lap}</td>
              {(["s1", "s2", "s3", "total"] as const).map((field) => (
                <td key={field} className="px-2 py-1.5">
                  {readOnly ? (
                    <span className="font-mono tabular-nums">{row[field] || "—"}</span>
                  ) : (
                    <input
                      type="text"
                      inputMode="decimal"
                      value={row[field]}
                      onChange={(e) => updateRow(row.id, { [field]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const next = e.currentTarget.closest("tr")?.nextElementSibling;
                          const input = next?.querySelector("input");
                          input?.focus();
                        }
                      }}
                      className={cellClass(row.id, field)}
                      aria-label={`Volta ${row.lap} ${field}`}
                    />
                  )}
                </td>
              ))}
              {!readOnly ? (
                <td className="px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="rounded-lg p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                    aria-label="Remover volta"
                  >
                    <HiTrash className="h-4 w-4" />
                  </button>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
      {!readOnly && !hideAddButton ? (
        <button
          type="button"
          onClick={addRow}
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-dashed border-[rgba(13,31,60,0.25)] px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] hover:border-accent/40"
        >
          <HiPlus className="h-4 w-4" />
          Adicionar volta
        </button>
      ) : null}
    </div>
  );
}
