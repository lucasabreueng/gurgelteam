"use client";

import { useState } from "react";
import { HiChevronDown } from "react-icons/hi2";
import type {
  ChecklistItemEvaluation,
  ChecklistItemRating,
  ChecklistTemplateGroup,
} from "@/lib/contracts/maintenance/complete-checklist";
import { CHECKLIST_ITEM_RATING_LABELS } from "@/lib/contracts/maintenance/complete-checklist";
import { settingsTextareaClass } from "@/components/admin/settings/settings-section";

const RATING_OPTIONS: ChecklistItemRating[] = ["ok", "atencao", "reprovado"];

const RATING_BTN: Record<ChecklistItemRating, string> = {
  ok: "bg-emerald-600 text-white",
  atencao: "bg-amber-500 text-white",
  reprovado: "bg-red-600 text-white",
};

type Props = {
  groups: ChecklistTemplateGroup[];
  evaluations: Record<string, ChecklistItemEvaluation>;
  onChange: (itemId: string, patch: Partial<ChecklistItemEvaluation>) => void;
};

export function ChecklistEvaluationAccordion({
  groups,
  evaluations,
  onChange,
}: Props) {
  const [openId, setOpenId] = useState<string | null>(groups[0]?.id ?? null);
  const [noteOpen, setNoteOpen] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-2">
      {groups.map((group) => {
        const open = openId === group.id;
        const groupEvals = group.items.map((i) => evaluations[i.id]);
        const ratedCount = groupEvals.filter((e) => e?.rating).length;
        const fails = groupEvals.filter((e) => e?.rating === "reprovado").length;
        const warns = groupEvals.filter((e) => e?.rating === "atencao").length;
        const summary =
          fails > 0
            ? { label: `${fails} reprov.`, className: "bg-red-100 text-red-800" }
            : warns > 0
              ? {
                  label: `${warns} atenção`,
                  className: "bg-amber-100 text-amber-900",
                }
              : ratedCount === group.items.length
                ? { label: "OK", className: "bg-emerald-100 text-emerald-800" }
                : {
                    label: "Pendente",
                    className: "bg-neutral-100 text-neutral-600",
                  };

        return (
          <div
            key={group.id}
            className="overflow-hidden rounded-xl border border-[rgba(17,17,17,0.08)] bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpenId((id) => (id === group.id ? null : group.id))}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-[#fafbfc]"
              aria-expanded={open}
            >
              <span className="text-sm font-bold text-[#0d1f3c]">{group.title}</span>
              <span className="flex items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${summary.className}`}
                >
                  {summary.label}
                </span>
                <HiChevronDown
                  className={`h-5 w-5 text-neutral-500 transition-transform duration-300 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <ul className="space-y-4 border-t border-[rgba(17,17,17,0.06)] bg-[#fafbfc]/60 px-3 py-3">
                  {group.items.map((item) => {
                    const ev = evaluations[item.id] ?? { itemId: item.id };
                    const noteVisible = Boolean(noteOpen[item.id]);

                    const toggleNote = () => {
                      if (noteVisible) {
                        setNoteOpen((prev) => ({ ...prev, [item.id]: false }));
                        onChange(item.id, { note: undefined });
                        return;
                      }
                      setNoteOpen((prev) => ({ ...prev, [item.id]: true }));
                    };

                    return (
                      <li
                        key={item.id}
                        className="rounded-lg bg-white p-3 ring-1 ring-[rgba(17,17,17,0.06)]"
                      >
                        <p className="text-sm font-semibold text-[#0d1f3c]">
                          {item.label}
                        </p>
                        <div className="mt-2 grid grid-cols-4 gap-1.5">
                          {RATING_OPTIONS.map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => onChange(item.id, { rating })}
                              className={`w-full rounded-lg px-1 py-2 text-[10px] font-bold uppercase tracking-wide transition ${
                                ev.rating === rating
                                  ? RATING_BTN[rating]
                                  : "bg-[#fafbfc] text-neutral-600 ring-1 ring-[rgba(17,17,17,0.08)]"
                              }`}
                            >
                              {CHECKLIST_ITEM_RATING_LABELS[rating]}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={toggleNote}
                            className={`w-full rounded-lg px-0.5 py-2 text-[8px] font-bold uppercase leading-tight tracking-wide transition sm:text-[9px] ${
                              noteVisible
                                ? "bg-[#0d1f3c] text-white"
                                : "bg-[#fafbfc] text-neutral-600 ring-1 ring-[rgba(17,17,17,0.08)]"
                            }`}
                          >
                            {noteVisible ? "Retirar observação" : "Adicionar observação"}
                          </button>
                        </div>
                        {noteVisible ? (
                          <textarea
                            value={ev.note ?? ""}
                            onChange={(e) =>
                              onChange(item.id, { note: e.target.value })
                            }
                            rows={2}
                            placeholder="Observação sobre este item…"
                            className={`${settingsTextareaClass} mt-2`}
                          />
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
