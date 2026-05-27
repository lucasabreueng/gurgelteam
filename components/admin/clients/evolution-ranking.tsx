"use client";

import { ClientsServiceMock } from "@/services/clients/clientsServiceMock";


import Image from "next/image";
import { useState } from "react";


const TABS = [
  { key: "evolution" as const, label: "Mais evoluíram" },
  { key: "training" as const, label: "Mais treinaram" },
  { key: "laps" as const, label: "Melhores tempos" },
  { key: "consistency" as const, label: "Maior consistência" },
];

export function EvolutionRanking() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("evolution");
  const entries = ClientsServiceMock.getEvolutionRankings()[tab];

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#0d1f3c]">
            Ranking de evolução
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            Destaques do mês na base de pilotos.
          </p>
        </div>
        <div className="inline-flex shrink-0 flex-wrap justify-end rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] p-1 sm:ml-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition ${
                tab === t.key
                  ? "bg-[#0d1f3c] text-white shadow-sm"
                  : "text-neutral-600 hover:text-[#0d1f3c]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <ol className="mt-5 space-y-2">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="flex items-center gap-4 rounded-xl border border-[rgba(17,17,17,0.08)] bg-white px-4 py-3 shadow-sm"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0d1f3c] text-sm font-bold text-white">
              {entry.rank}
            </span>
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white">
              <Image
                src={entry.avatar}
                alt=""
                fill
                className="object-cover"
                sizes="40px"
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[#0d1f3c]">{entry.name}</p>
              <p className="text-[11px] text-neutral-500">{entry.metric}</p>
            </div>
            <p className="font-bold tabular-nums text-accent">{entry.value}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
