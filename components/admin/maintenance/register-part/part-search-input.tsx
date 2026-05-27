"use client";

import type { PartCatalogItem } from "@/lib/contracts/parts";

import { PartsServiceMock } from "@/services/parts/partsServiceMock";

import { useMemo, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

import { settingsInputClass } from "../../settings/settings-section";
import { BarcodeScannerButton } from "./barcode-scanner-button";
import { PartAutocompleteCard } from "./part-autocomplete-card";

type Props = {
  selectedId: string | null;
  onSelect: (part: PartCatalogItem) => void;
  onScan: (part: PartCatalogItem) => void;
};

export function PartSearchInput({ selectedId, onSelect, onScan }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => PartsServiceMock.searchCatalog(query), [query]);

  return (
    <section className="space-y-3">
      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
          Buscar peça
        </span>
        <div className="relative mt-1.5">
          <HiMagnifyingGlass
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nome, código, categoria, fornecedor…"
            className={`${settingsInputClass} min-h-[48px] w-full pl-10 pr-4`}
            aria-label="Buscar peça"
            autoComplete="off"
          />
        </div>
      </label>

      <BarcodeScannerButton
        onScan={(part) => {
          onScan(part);
          setQuery(part.name);
        }}
      />

      {query.trim() && !selectedId ? (
        <ul className="max-h-[280px] space-y-2 overflow-y-auto rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-neutral-500">
              Nenhuma peça encontrada
            </li>
          ) : (
            results.map((part) => (
              <li key={part.id}>
                <PartAutocompleteCard
                  part={part}
                  onSelect={() => {
                    onSelect(part);
                    setQuery(part.name);
                  }}
                />
              </li>
            ))
          )}
        </ul>
      ) : null}
    </section>
  );
}
