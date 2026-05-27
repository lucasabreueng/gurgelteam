"use client";

import type { PlanPackage } from "@/lib/contracts/settings";
import {
  formatCentsToBRL,
  parseBRLToCents,
  parseValidityDays,
} from "@/lib/plan-package-utils";
import { HiTrash } from "react-icons/hi2";
import {
  SettingsField,
  settingsInputClass,
  settingsTextareaClass,
} from "./settings-section";
import { SettingsToggle } from "./settings-toggle";

type Props = {
  plan: PlanPackage;
  onUpdate: (patch: Partial<PlanPackage>) => void;
  onToggleActive: (active: boolean) => void;
  onRequestRemove: () => void;
  canRemove: boolean;
};

export function PlanCard({
  plan,
  onUpdate,
  onToggleActive,
  onRequestRemove,
  canRemove,
}: Props) {
  return (
    <article
      className={`flex h-full flex-col rounded-2xl border p-5 transition md:p-6 ${
        plan.active
          ? "border-accent/20 bg-white shadow-[0_2px_12px_rgba(13,31,60,0.06)]"
          : "border-[rgba(17,17,17,0.08)] bg-neutral-50/80"
      }`}
    >
      <div className="grid grid-cols-3 gap-3">
        <SettingsField label="Descrição">
          <input
            className={settingsInputClass}
            value={plan.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
        </SettingsField>
        <SettingsField label="Valor">
          <input
            className={settingsInputClass}
            inputMode="numeric"
            value={formatCentsToBRL(plan.priceCents)}
            onChange={(e) =>
              onUpdate({ priceCents: parseBRLToCents(e.target.value) })
            }
          />
        </SettingsField>
        <SettingsField label="Validade">
          <div className="flex overflow-hidden rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] focus-within:border-accent focus-within:bg-white focus-within:ring-2 focus-within:ring-accent/15">
            <input
              type="text"
              inputMode="numeric"
              className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-[14px] text-[#111] outline-none"
              value={plan.validityDays === 0 ? "" : String(plan.validityDays)}
              onChange={(e) =>
                onUpdate({
                  validityDays: parseValidityDays(e.target.value),
                })
              }
              placeholder="0"
            />
            <span className="flex shrink-0 items-center border-l border-[rgba(17,17,17,0.08)] bg-white/80 px-3 text-[13px] font-semibold text-neutral-500">
              dias
            </span>
          </div>
        </SettingsField>
      </div>

      <div className="mt-4">
        <SettingsField label="Descrição do pacote">
          <textarea
            className={`${settingsTextareaClass} min-h-[88px]`}
            value={plan.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Resumo comercial do pacote"
          />
        </SettingsField>
      </div>

      <div className="mt-4 flex-1">
        <SettingsField label="Itens inclusos (um item por linha)">
          <textarea
            className={`${settingsTextareaClass} min-h-[100px]`}
            value={plan.includedItems}
            onChange={(e) => onUpdate({ includedItems: e.target.value })}
            placeholder={"Ex.:\n5 aulas na pista\nBriefing técnico"}
          />
        </SettingsField>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[rgba(17,17,17,0.06)] pt-4">
        <SettingsToggle
          label={plan.active ? "Ativo" : "Desativado"}
          checked={plan.active}
          onChange={onToggleActive}
        />
        <SettingsToggle
          label={plan.isPacote ? "Pacote" : "Avulso"}
          checked={plan.isPacote}
          onChange={(isPacote) => onUpdate({ isPacote })}
        />
        {canRemove ? (
          <button
            type="button"
            onClick={onRequestRemove}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl border border-[#c41e3a]/20 text-[#c41e3a] transition hover:bg-red-50"
            aria-label="Remover pacote"
          >
            <HiTrash className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </article>
  );
}
