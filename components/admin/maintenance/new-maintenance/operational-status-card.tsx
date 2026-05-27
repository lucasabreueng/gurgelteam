"use client";

import type { OperationalStatusKey } from "@/lib/contracts/maintenance";
import { HiExclamationTriangle } from "react-icons/hi2";

const OPTIONS: { key: OperationalStatusKey; label: string; desc: string }[] = [
  {
    key: "normal",
    label: "Pode rodar normalmente",
    desc: "Kart permanece na operação com restrições leves.",
  },
  {
    key: "restrito",
    label: "Restrito",
    desc: "Uso limitado até conclusão da OS.",
  },
  {
    key: "bloqueado",
    label: "Bloquear kart",
    desc: "Removido da agenda e disponibilidade.",
  },
];

type Props = {
  selected: OperationalStatusKey;
  onSelect: (key: OperationalStatusKey) => void;
};

export function OperationalStatusCard({ selected, onSelect }: Props) {
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-[#0d1f3c]">Status operacional</h2>
      <ul className="mt-3 space-y-2">
        {OPTIONS.map((opt) => (
          <li key={opt.key}>
            <button
              type="button"
              onClick={() => onSelect(opt.key)}
              className={`w-full rounded-xl border-2 px-4 py-3 text-left transition ${
                selected === opt.key
                  ? opt.key === "bloqueado"
                    ? "border-red-400 bg-red-50"
                    : opt.key === "restrito"
                      ? "border-amber-300 bg-amber-50"
                      : "border-emerald-300 bg-emerald-50"
                  : "border-[rgba(17,17,17,0.08)] bg-white hover:bg-[#fafbfc]"
              }`}
            >
              <span className="block text-sm font-bold text-[#0d1f3c]">
                {opt.label}
              </span>
              <span className="mt-0.5 block text-xs text-neutral-500">
                {opt.desc}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {selected === "bloqueado" ? (
        <div className="mt-3 flex gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs font-semibold text-red-800">
          <HiExclamationTriangle className="h-5 w-5 shrink-0" aria-hidden />
          O kart será removido automaticamente da agenda e disponibilidade.
        </div>
      ) : null}
    </section>
  );
}
