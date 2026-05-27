"use client";

import type { PlanCategory, PlanPackage } from "@/lib/contracts/settings";

import { SettingsServiceMock } from "@/services/settings/settingsServiceMock";

import { useCallback, useState } from "react";
import { HiChevronDown, HiPlus } from "react-icons/hi2";

import { ConfirmDialog } from "./confirm-dialog";
import { PlanCard } from "./plan-card";
import { SettingsSection } from "./settings-section";

type PendingDelete = {
  catId: string;
  planId: string;
  name: string;
} | null;

type Props = {
  categories: PlanCategory[];
  onCategoriesChange: (categories: PlanCategory[]) => void;
  onDirty: () => void;
};

export function PlansPackagesPanel({
  categories,
  onCategoriesChange,
  onDirty,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(
    categories[0]?.id ?? null
  );
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);
  const touch = () => onDirty();

  const toggleCategory = useCallback((catId: string) => {
    setExpandedId((prev) => (prev === catId ? null : catId));
  }, []);

  const updatePlan = (
    catId: string,
    planId: string,
    patch: Partial<PlanPackage>
  ) => {
    onCategoriesChange(
      categories.map((c) =>
        c.id === catId
          ? {
              ...c,
              plans: c.plans.map((p) =>
                p.id === planId ? { ...p, ...patch } : p
              ),
            }
          : c
      )
    );
    touch();
  };

  const removePlan = (catId: string, planId: string) => {
    onCategoriesChange(
      categories.map((c) =>
        c.id === catId
          ? { ...c, plans: c.plans.filter((p) => p.id !== planId) }
          : c
      )
    );
    touch();
  };

  const addPlan = (catId: string) => {
    onCategoriesChange(
      categories.map((c) =>
        c.id === catId ? { ...c, plans: [...c.plans, SettingsServiceMock.createEmptyPlan()] } : c
      )
    );
    setExpandedId(catId);
    touch();
  };

  const activeCount = (plans: PlanPackage[]) =>
    plans.filter((p) => p.active).length;

  const confirmDelete = () => {
    if (!pendingDelete) return;
    removePlan(pendingDelete.catId, pendingDelete.planId);
    setPendingDelete(null);
  };

  return (
    <SettingsSection
      title="Planos e pacotes"
      description="Pacotes por categoria de kart. As categorias são definidas em Categorias e níveis."
    >
      {categories.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[rgba(17,17,17,0.12)] bg-[#fafbfc] px-4 py-8 text-center text-sm text-neutral-500">
          Nenhuma categoria cadastrada. Adicione categorias em{" "}
          <strong className="text-[#0d1f3c]">Categorias e níveis</strong>.
        </p>
      ) : (
        <ul className="space-y-3" role="list">
          {categories.map((category) => {
            const isOpen = expandedId === category.id;
            const panelId = `plans-panel-${category.id}`;
            const triggerId = `plans-trigger-${category.id}`;

            return (
              <li
                key={category.id}
                className={`overflow-hidden rounded-2xl border transition ${
                  isOpen
                    ? "border-accent/25 bg-white shadow-[0_4px_20px_rgba(13,31,60,0.08)]"
                    : "border-[rgba(17,17,17,0.08)] bg-[#fafbfc]"
                }`}
              >
                <div className="flex items-center gap-2 px-3 py-3 md:px-4 md:py-4">
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleCategory(category.id)}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                      isOpen
                        ? "bg-accent text-white"
                        : "bg-[rgba(13,31,60,0.07)] text-accent"
                    }`}
                    aria-label={
                      isOpen ? "Recolher categoria" : "Expandir categoria"
                    }
                  >
                    <HiChevronDown
                      className={`h-5 w-5 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    />
                  </button>

                  <div className="min-w-0 flex-1">
                    <span className="block text-base font-bold text-[#0d1f3c] md:text-lg">
                      {category.name}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-neutral-500">
                      {category.plans.length} pacote
                      {category.plans.length !== 1 ? "s" : ""} ·{" "}
                      {activeCount(category.plans)} ativo
                      {activeCount(category.plans) !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addPlan(category.id);
                    }}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[rgba(13,31,60,0.2)] bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-accent/30"
                  >
                    <HiPlus className="h-3.5 w-3.5" aria-hidden />
                    Novo pacote
                  </button>
                </div>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  hidden={!isOpen}
                  className={isOpen ? "block" : "hidden"}
                >
                  <div className="border-t border-[rgba(17,17,17,0.08)] px-4 pb-5 pt-4 md:px-5 md:pb-6 md:pt-5">
                    {category.plans.length > 0 ? (
                      <ul
                        className={`grid gap-4 ${
                          category.plans.length === 3
                            ? "grid-cols-1 lg:grid-cols-3"
                            : "grid-cols-1 lg:grid-cols-2"
                        }`}
                      >
                        {category.plans.map((plan) => (
                          <li key={plan.id}>
                            <PlanCard
                              plan={plan}
                              canRemove={category.plans.length > 1}
                              onUpdate={(patch) =>
                                updatePlan(category.id, plan.id, patch)
                              }
                              onToggleActive={(active) =>
                                updatePlan(category.id, plan.id, { active })
                              }
                              onRequestRemove={() =>
                                setPendingDelete({
                                  catId: category.id,
                                  planId: plan.id,
                                  name: plan.name,
                                })
                              }
                            />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-6 text-center text-sm text-neutral-500">
                        Nenhum pacote nesta categoria.{" "}
                        <button
                          type="button"
                          className="font-semibold text-accent underline"
                          onClick={() => addPlan(category.id)}
                        >
                          Adicionar pacote
                        </button>
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Remover pacote?"
        message={
          pendingDelete
            ? `Tem certeza que deseja excluir o pacote "${pendingDelete.name}"? Esta ação não pode ser desfeita.`
            : ""
        }
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </SettingsSection>
  );
}
