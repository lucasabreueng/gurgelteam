"use client";

import { getAppServices } from "@/lib/data-source/app-services";
import type { MaintenanceKartOption } from "@/lib/contracts/maintenance";
import { useEffect, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { settingsInputClass } from "../../settings/settings-section";
import { KartTechnicalCard } from "./kart-technical-card";

type Props = {
  selected: MaintenanceKartOption | null;
  onSelect: (kart: MaintenanceKartOption) => void;
};

export function KartSearchSelector({ selected, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MaintenanceKartOption[]>([]);

  useEffect(() => {
    let active = true;
    void getAppServices()
      .newMaintenance.searchKarts(query)
      .then((rows) => {
        if (active) setResults(rows);
      });
    return () => {
      active = false;
    };
  }, [query]);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-sm font-bold text-[#0d1f3c]">Seleção do kart</h2>
        <p className="mt-1 text-xs text-neutral-500">
          Busque por número, categoria, proprietário ou status
        </p>
      </div>
      <div className="relative">
        <HiMagnifyingGlass
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex.: 12, competição, frota, manutenção…"
          className={`${settingsInputClass} min-h-[48px] w-full pl-10`}
        />
      </div>
      {selected ? <KartTechnicalCard kart={selected} /> : null}
      <ul className="max-h-[240px] space-y-2 overflow-y-auto">
        {results.map((k) => (
          <li key={k.id}>
            <button
              type="button"
              onClick={() => {
                onSelect(k);
                setQuery(String(k.number));
              }}
              className={`flex w-full items-center gap-3 rounded-xl border-2 px-3 py-3 text-left transition ${
                selected?.id === k.id
                  ? "border-accent bg-accent/5"
                  : "border-[rgba(17,17,17,0.08)] bg-white hover:border-accent/25"
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0d1f3c] text-sm font-black text-white">
                {k.number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-[#0d1f3c]">
                  {k.categoryName}
                </span>
                <span className="block truncate text-xs text-neutral-500">
                  {k.ownerName} · {k.statusLabel}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
