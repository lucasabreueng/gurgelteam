"use client";

import { useChecklistContext } from "@/lib/query/hooks/use-checklist-context";

const resultClass: Record<string, string> = {
  Liberado: "text-emerald-700 bg-emerald-50 ring-emerald-200/60",
  Restrito: "text-amber-800 bg-amber-50 ring-amber-200/60",
  Bloqueado: "text-red-800 bg-red-50 ring-red-200/60",
};

export function ChecklistHistoryTimeline() {
  const { data, isLoading } = useChecklistContext();
  const history = data?.history ?? [];

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm md:p-5">
      <h3 className="text-sm font-bold text-[#0d1f3c]">Histórico de checklist</h3>
      {isLoading ? (
        <p className="mt-4 text-sm text-neutral-500">Carregando histórico…</p>
      ) : history.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-500">
          Nenhum checklist registrado ainda.
        </p>
      ) : (
        <ul className="relative mt-4 space-y-0 border-l-2 border-[rgba(13,31,60,0.12)] pl-5">
          {history.map((h) => (
            <li key={h.id} className="relative pb-5 last:pb-0">
              <span
                className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#0d1f3c] ring-4 ring-white"
                aria-hidden
              />
              <p className="text-[11px] font-bold uppercase text-neutral-500">
                {h.date}
              </p>
              <p className="font-bold text-[#0d1f3c]">{h.responsible}</p>
              <span
                className={`mt-1 inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${resultClass[h.result] ?? "text-neutral-700 bg-neutral-50 ring-neutral-200/60"}`}
              >
                {h.result}
              </span>
              <p className="mt-2 text-sm text-neutral-600">{h.notes}</p>
              {h.photos > 0 ? (
                <p className="mt-1 text-xs font-semibold text-neutral-500">
                  {h.photos} foto{h.photos > 1 ? "s" : ""}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
