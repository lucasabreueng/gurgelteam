"use client";

import type { CategoryPrice } from "@/lib/contracts/settings";
import {
  formatCentsToBRL,
  parseBRLToCents,
} from "@/lib/plan-package-utils";

import { useCallback, useState } from "react";
import { HiChevronDown } from "react-icons/hi2";

import {
  SettingsField,
  SettingsSection,
  settingsInputClass,
  settingsTextareaClass,
} from "./settings-section";

type Props = {
  prices: CategoryPrice[];
  onPricesChange: (prices: CategoryPrice[]) => void;
  onDirty: () => void;
};

export function PricesPanel({ prices, onPricesChange, onDirty }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(
    prices[0]?.id ?? null
  );

  const touch = () => onDirty();

  const updateCategory = (id: string, patch: Partial<CategoryPrice>) => {
    onPricesChange(
      prices.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
    touch();
  };

  const toggleCategory = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <SettingsSection
      title="Preços"
      description="Valor da aula avulsa por categoria de kart. As categorias são definidas em Categorias e níveis."
    >
      {prices.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[rgba(17,17,17,0.12)] bg-[#fafbfc] px-4 py-8 text-center text-sm text-neutral-500">
          Nenhuma categoria cadastrada. Adicione categorias em{" "}
          <strong className="text-[#0d1f3c]">Categorias e níveis</strong>.
        </p>
      ) : (
        <ul className="space-y-3" role="list">
          {prices.map((row) => {
            const isOpen = expandedId === row.id;
            const panelId = `price-panel-${row.id}`;
            const triggerId = `price-trigger-${row.id}`;

            return (
              <li
                key={row.id}
                className={`overflow-hidden rounded-2xl border transition ${
                  isOpen
                    ? "border-accent/25 bg-white shadow-[0_4px_20px_rgba(13,31,60,0.08)]"
                    : "border-[rgba(17,17,17,0.08)] bg-[#fafbfc]"
                }`}
              >
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleCategory(row.id)}
                  className="flex w-full items-center gap-3 px-3 py-3 text-left md:px-4 md:py-4"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                      isOpen
                        ? "bg-accent text-white"
                        : "bg-[rgba(13,31,60,0.07)] text-accent"
                    }`}
                  >
                    <HiChevronDown
                      className={`h-5 w-5 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-bold text-[#0d1f3c] md:text-lg">
                      {row.name}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-neutral-500">
                      Aula avulsa · {formatCentsToBRL(row.singleLessonPriceCents)}
                    </span>
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  hidden={!isOpen}
                  className={isOpen ? "block" : "hidden"}
                >
                  <div className="space-y-4 border-t border-[rgba(17,17,17,0.08)] px-4 pb-5 pt-4 md:px-5 md:pb-6">
                    <SettingsField label="Preço da aula avulsa">
                      <input
                        className={settingsInputClass}
                        inputMode="decimal"
                        value={formatCentsToBRL(row.singleLessonPriceCents)}
                        onChange={(e) => {
                          updateCategory(row.id, {
                            singleLessonPriceCents: parseBRLToCents(
                              e.target.value
                            ),
                          });
                        }}
                        aria-label={`Preço aula avulsa — ${row.name}`}
                      />
                    </SettingsField>
                    <SettingsField label="Descrição">
                      <textarea
                        className={settingsTextareaClass}
                        value={row.description}
                        onChange={(e) =>
                          updateCategory(row.id, {
                            description: e.target.value,
                          })
                        }
                      />
                    </SettingsField>
                    <SettingsField label="Itens inclusos">
                      <textarea
                        className={settingsTextareaClass}
                        value={row.includedItems}
                        onChange={(e) =>
                          updateCategory(row.id, {
                            includedItems: e.target.value,
                          })
                        }
                        placeholder="Um item por linha"
                      />
                    </SettingsField>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </SettingsSection>
  );
}
