"use client";

import type { KartCategory, SkillLevel } from "@/lib/contracts/settings";

import { SettingsServiceMock } from "@/services/settings/settingsServiceMock";

import { useCallback, useState } from "react";
import { HiChevronDown, HiPencil, HiPlus, HiTrash } from "react-icons/hi2";

import {
  formatTimeHundredths,
  parseTimeHundredths,
} from "@/lib/plan-package-utils";
import {
  adminAccordionItemClass,
  adminAccordionPanelClass,
  adminAccordionTitleClass,
  adminAccordionTriggerIconClass,
} from "@/lib/design";
import { ConfirmDialog } from "./confirm-dialog";
import { SettingsSection, settingsInputClass } from "./settings-section";

type Props = {
  categories: KartCategory[];
  onCategoriesChange: (categories: KartCategory[]) => void;
  levels: SkillLevel[];
  onLevelsChange: (levels: SkillLevel[]) => void;
  onDirty: () => void;
};

type View = "categorias" | "niveis";

type PendingDelete =
  | { type: "category"; id: string; name: string }
  | null;

function levelSummary(level: SkillLevel, categories: KartCategory[]) {
  const filled = level.categoryRequirements.filter(
    (r) => r.timeHundredths > 0
  ).length;
  return `${filled} de ${categories.length} categorias com tempo definido`;
}

export function CategoriesLevelsPanel({
  categories,
  onCategoriesChange,
  levels,
  onLevelsChange,
  onDirty,
}: Props) {
  const [view, setView] = useState<View>("categorias");
  const [expandedId, setExpandedId] = useState<string | null>(
    levels[0]?.id ?? null
  );
  const [editingLevelId, setEditingLevelId] = useState<string | null>(null);
  const [editingKartCatId, setEditingKartCatId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);

  const touch = () => onDirty();

  const toggleLevel = useCallback((levelId: string) => {
    setExpandedId((prev) => (prev === levelId ? null : levelId));
  }, []);

  const updateCategoryName = (id: string, name: string) => {
    onCategoriesChange(
      categories.map((c) => (c.id === id ? { ...c, name } : c))
    );
    touch();
  };

  const addKartCategory = () => {
    const created = SettingsServiceMock.createKartCategory();
    onCategoriesChange([...categories, created]);
    setEditingKartCatId(created.id);
    requestAnimationFrame(() => {
      document.getElementById(`kart-cat-${created.id}`)?.focus();
    });
    touch();
  };

  const removeKartCategory = (id: string) => {
    onCategoriesChange(categories.filter((c) => c.id !== id));
    if (editingKartCatId === id) setEditingKartCatId(null);
    touch();
  };

  const startEditLevel = (levelId: string) => {
    setEditingLevelId(levelId);
    requestAnimationFrame(() => {
      document.getElementById(`level-edit-${levelId}`)?.focus();
    });
  };

  const finishEditLevel = () => setEditingLevelId(null);

  const updateLevel = (levelId: string, patch: Partial<SkillLevel>) => {
    onLevelsChange(
      levels.map((l) => (l.id === levelId ? { ...l, ...patch } : l))
    );
    touch();
  };

  const updateLevelTime = (
    levelId: string,
    categoryId: string,
    timeHundredths: number
  ) => {
    onLevelsChange(
      levels.map((l) =>
        l.id === levelId
          ? {
              ...l,
              categoryRequirements: l.categoryRequirements.map((r) =>
                r.categoryId === categoryId ? { ...r, timeHundredths } : r
              ),
            }
          : l
      )
    );
    touch();
  };

  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? "—";

  const viewToggle = (
    <div className="inline-flex rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] p-1">
      {(
        [
          ["categorias", "Categorias"],
          ["niveis", "Níveis"],
        ] as const
      ).map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => setView(key)}
          className={`rounded-lg px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition ${
            view === key
              ? "bg-[#0d1f3c] text-white shadow-sm"
              : "text-neutral-600 hover:text-[#0d1f3c]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <SettingsSection
      title="Categorias e níveis"
      description="Cadastre categorias de kart e defina, por nível, o critério de tempo em cada categoria."
      headerAction={viewToggle}
    >
      {view === "categorias" ? (
        <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-neutral-500">
                Categorias cadastradas
              </p>
              <p className="mt-1 text-sm text-neutral-600">
                Estas categorias aparecem nos níveis e na grade de horários.
              </p>
            </div>
            <button
              type="button"
              onClick={addKartCategory}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0d1f3c] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition hover:brightness-110"
            >
              <HiPlus className="h-4 w-4" aria-hidden />
              Nova categoria
            </button>
          </div>

          <ul className="mt-6 space-y-3">
            {categories.map((cat) => {
              const isEditing = editingKartCatId === cat.id;
              return (
                <li
                  key={cat.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-[rgba(17,17,17,0.08)] bg-white px-4 py-3 shadow-sm sm:flex-nowrap"
                >
                  {isEditing ? (
                    <input
                      id={`kart-cat-${cat.id}`}
                      className={`${settingsInputClass} min-w-[200px] flex-1`}
                      value={cat.name}
                      onChange={(e) =>
                        updateCategoryName(cat.id, e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === "Escape") {
                          setEditingKartCatId(null);
                        }
                      }}
                    />
                  ) : (
                    <span className="flex-1 text-base font-bold text-[#0d1f3c]">
                      {cat.name}
                    </span>
                  )}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      if (isEditing) e.preventDefault();
                    }}
                    onClick={() =>
                      isEditing
                        ? setEditingKartCatId(null)
                        : setEditingKartCatId(cat.id)
                    }
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(13,31,60,0.12)] bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c]"
                  >
                    <HiPencil className="h-3.5 w-3.5" aria-hidden />
                    {isEditing ? "Concluir" : "Editar"}
                  </button>
                  {categories.length > 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setPendingDelete({
                          type: "category",
                          id: cat.id,
                          name: cat.name,
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#c41e3a]/25 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#c41e3a]"
                    >
                      <HiTrash className="h-3.5 w-3.5" aria-hidden />
                      Remover
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>

          {categories.length === 0 ? (
            <p className="mt-4 text-sm text-amber-700">
              Cadastre ao menos uma categoria para configurar os níveis.
            </p>
          ) : null}
        </div>
      ) : (
        <>
          {categories.length === 0 ? (
            <p className="rounded-xl border border-amber-200/60 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Cadastre categorias na aba <strong>Categorias</strong> antes de
              configurar os níveis.
            </p>
          ) : null}

          <ul className="space-y-3" role="list">
            {levels.map((level) => {
              const isOpen = expandedId === level.id;
              const isEditing = editingLevelId === level.id;
              const panelId = `level-panel-${level.id}`;
              const triggerId = `level-trigger-${level.id}`;

              return (
                <li
                  key={level.id}
                  className={adminAccordionItemClass(isOpen)}
                >
                  <div className="flex items-center gap-2 px-3 py-3 md:px-4 md:py-4">
                    <button
                      id={triggerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleLevel(level.id)}
                      disabled={categories.length === 0}
                      className={`${adminAccordionTriggerIconClass(isOpen)} disabled:opacity-40`}
                    >
                      <HiChevronDown
                        className={`h-5 w-5 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden
                      />
                    </button>

                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <input
                          id={`level-edit-${level.id}`}
                          className={settingsInputClass}
                          value={level.name}
                          onChange={(e) =>
                            updateLevel(level.id, { name: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") finishEditLevel();
                            if (e.key === "Escape") finishEditLevel();
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <>
                          <span className="block text-base font-bold text-[#0d1f3c] md:text-lg">
                            {level.name}
                          </span>
                          <span className="mt-0.5 block text-[12px] text-neutral-500">
                            {levelSummary(level, categories)}
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={categories.length === 0}
                      onMouseDown={(e) => {
                        if (isEditing) e.preventDefault();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isEditing) finishEditLevel();
                        else startEditLevel(level.id);
                      }}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[rgba(13,31,60,0.12)] bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-accent/30 disabled:opacity-50"
                    >
                      <HiPencil className="h-3.5 w-3.5" aria-hidden />
                      {isEditing ? "Concluir" : "Editar"}
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
                      <ul className="flex flex-nowrap gap-3">
                        {level.categoryRequirements.map((req) => (
                          <li
                            key={req.categoryId}
                            className="flex min-w-0 flex-1 basis-0 items-center gap-3 rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-3 py-3"
                          >
                            <span className="shrink-0 rounded-lg bg-accent/10 px-2.5 py-1 text-[12px] font-bold text-[#0d1f3c]">
                              {categoryName(req.categoryId)}
                            </span>
                            <div className="flex min-w-0 flex-1 overflow-hidden rounded-xl border border-[rgba(17,17,17,0.1)] bg-white focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15">
                              <input
                                type="text"
                                inputMode="decimal"
                                className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-right text-[14px] tabular-nums text-[#111] outline-none"
                                value={
                                  req.timeHundredths === 0
                                    ? ""
                                    : formatTimeHundredths(req.timeHundredths)
                                }
                                placeholder="0,00"
                                onChange={(e) =>
                                  updateLevelTime(
                                    level.id,
                                    req.categoryId,
                                    parseTimeHundredths(e.target.value)
                                  )
                                }
                              />
                              <span className="flex shrink-0 items-center border-l border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-2.5 text-[13px] font-semibold text-neutral-500">
                                s
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Remover categoria?"
        message={
          pendingDelete
            ? `Excluir a categoria "${pendingDelete.name}"? Os critérios vinculados nos níveis serão removidos.`
            : ""
        }
        confirmLabel="Excluir"
        onConfirm={() => {
          if (pendingDelete?.type === "category") {
            removeKartCategory(pendingDelete.id);
          }
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </SettingsSection>
  );
}
