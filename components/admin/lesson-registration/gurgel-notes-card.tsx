"use client";

import type { GurgelSessionNotesDTO } from "@/lib/contracts/lessons/lesson-registration.types";

const inputClass =
  "mt-2 w-full resize-none rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] px-3 py-2.5 text-sm text-[#0d1f3c] outline-none focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/15";

type Props = {
  notes: GurgelSessionNotesDTO;
  onChange: (notes: GurgelSessionNotesDTO) => void;
  readOnly?: boolean;
};

export function GurgelNotesCard({ notes, onChange, readOnly }: Props) {
  return (
    <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c]">
        Feedback do treinador
      </h4>

      <label className="mt-4 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        Feedback
        <textarea
          rows={4}
          readOnly={readOnly}
          value={notes.general}
          onChange={(e) => onChange({ ...notes, general: e.target.value })}
          className={inputClass}
          placeholder="Resumo geral da sessão para o piloto…"
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          Pontos positivos
          <textarea
            rows={3}
            readOnly={readOnly}
            value={notes.positives}
            onChange={(e) => onChange({ ...notes, positives: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          Pontos negativos
          <textarea
            rows={3}
            readOnly={readOnly}
            value={notes.improvements}
            onChange={(e) =>
              onChange({ ...notes, improvements: e.target.value })
            }
            className={inputClass}
          />
        </label>
      </div>
    </div>
  );
}
