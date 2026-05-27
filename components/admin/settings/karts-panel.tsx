"use client";

import type { KartOwnership } from "@/lib/contracts/karts";
import type { KartCategory, SettingsKartRow } from "@/lib/contracts/settings";

import { SettingsServiceMock } from "@/services/settings/settingsServiceMock";

import { useCallback, useState } from "react";
import { HiChevronDown, HiPlus, HiTrash } from "react-icons/hi2";

import { ConfirmDialog } from "./confirm-dialog";
import { SettingsDropdown } from "./settings-dropdown";
import {
  SettingsField,
  SettingsSection,
  settingsInputClass,
  settingsOutlineButtonClass,
} from "./settings-section";

type Props = {
  kartCategories: KartCategory[];
  karts: SettingsKartRow[];
  onKartsChange: (karts: SettingsKartRow[]) => void;
  onDirty: () => void;
};

type View = "proprios" | "clientes";

type PendingDelete = { id: string; label: string } | null;

const VIEW_OWNERSHIP: Record<View, KartOwnership> = {
  proprios: "rental",
  clientes: "client",
};

function kartNumberLabel(number: number) {
  return `Kart ${String(number).padStart(2, "0")}`;
}

function KartAccordionFields({
  kart,
  showClientName,
  categoryOptions,
  onUpdate,
}: {
  kart: SettingsKartRow;
  showClientName: boolean;
  categoryOptions: { value: string; label: string }[];
  onUpdate: (patch: Partial<SettingsKartRow>) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SettingsField label="Número">
        <input
          type="number"
          min={1}
          className={`${settingsInputClass} tabular-nums`}
          value={kart.number}
          onChange={(e) => {
            const n = Number.parseInt(e.target.value, 10);
            if (!Number.isNaN(n) && n > 0) onUpdate({ number: n });
          }}
        />
      </SettingsField>
      <SettingsField label="Categoria">
        <SettingsDropdown
          aria-label="Categoria do kart"
          value={kart.categoryId}
          options={categoryOptions}
          onSelect={(categoryId) => onUpdate({ categoryId })}
        />
      </SettingsField>
      {showClientName ? (
        <div className="sm:col-span-2">
          <SettingsField label="Nome do cliente">
            <input
              className={settingsInputClass}
              value={kart.clientName}
              placeholder="Ex.: João Silva ou Equipe Velocity"
              onChange={(e) => onUpdate({ clientName: e.target.value })}
            />
          </SettingsField>
        </div>
      ) : null}
    </div>
  );
}

function KartListByCategory({
  ownership,
  showClientName,
  kartCategories,
  karts,
  canConfigure,
  expandedKartId,
  onToggleKart,
  onKartsChange,
  onDirty,
  onExpandKart,
  onRequestDelete,
}: {
  ownership: KartOwnership;
  showClientName: boolean;
  kartCategories: KartCategory[];
  karts: SettingsKartRow[];
  canConfigure: boolean;
  expandedKartId: string | null;
  onToggleKart: (id: string) => void;
  onKartsChange: (karts: SettingsKartRow[]) => void;
  onDirty: () => void;
  onExpandKart: (id: string) => void;
  onRequestDelete: (kart: SettingsKartRow) => void;
}) {
  const categoryOptions = kartCategories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const categoryName = (id: string) =>
    kartCategories.find((c) => c.id === id)?.name ?? "—";

  const ownershipKarts = karts.filter((k) => k.ownership === ownership);

  const updateKart = (id: string, patch: Partial<SettingsKartRow>) => {
    onKartsChange(karts.map((k) => (k.id === id ? { ...k, ...patch } : k)));
    onDirty();
  };

  const addKart = (categoryId: string) => {
    const number = SettingsServiceMock.nextSettingsKartNumber(karts);
    const created = SettingsServiceMock.createSettingsKart(ownership, categoryId, number);
    onKartsChange([...karts, created]);
    onExpandKart(created.id);
    onDirty();
  };

  return (
    <div className="space-y-8">
      {kartCategories.map((category) => {
        const categoryKarts = ownershipKarts
          .filter((k) => k.categoryId === category.id)
          .sort((a, b) => a.number - b.number);

        return (
          <div key={`${ownership}-${category.id}`}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[12px] font-bold uppercase tracking-wider text-neutral-500">
                {category.name}
                <span className="ml-2 font-normal normal-case text-neutral-400">
                  · {categoryKarts.length}{" "}
                  {categoryKarts.length === 1 ? "kart" : "karts"}
                </span>
              </p>
              <button
                type="button"
                disabled={!canConfigure}
                onClick={() => addKart(category.id)}
                className={settingsOutlineButtonClass}
              >
                <HiPlus className="h-3.5 w-3.5" aria-hidden />
                Adicionar kart
              </button>
            </div>

            {categoryKarts.length > 0 ? (
              <ul className="space-y-3" role="list">
                {categoryKarts.map((kart) => {
                  const isOpen = expandedKartId === kart.id;
                  const panelId = `kart-panel-${kart.id}`;
                  const triggerId = `kart-trigger-${kart.id}`;
                  const subtitle = showClientName
                    ? kart.clientName.trim()
                      ? `${kart.clientName.trim()} · ${categoryName(kart.categoryId)}`
                      : categoryName(kart.categoryId)
                    : categoryName(kart.categoryId);

                  return (
                    <li
                      key={kart.id}
                      className={`rounded-2xl border transition ${
                        isOpen
                          ? "overflow-visible border-accent/25 bg-white shadow-[0_4px_20px_rgba(13,31,60,0.08)]"
                          : "overflow-hidden border-[rgba(17,17,17,0.08)] bg-[#fafbfc]"
                      }`}
                    >
                      <div className="flex items-center gap-2 px-3 py-3 md:px-4 md:py-4">
                        <button
                          id={triggerId}
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => onToggleKart(kart.id)}
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                            isOpen
                              ? "bg-accent text-white"
                              : "bg-[rgba(13,31,60,0.07)] text-accent"
                          }`}
                          aria-label={
                            isOpen ? "Recolher kart" : "Expandir kart"
                          }
                        >
                          <HiChevronDown
                            className={`h-5 w-5 transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                            aria-hidden
                          />
                        </button>

                        <button
                          type="button"
                          className="min-w-0 flex-1 text-left"
                          onClick={() => onToggleKart(kart.id)}
                        >
                          <span className="block text-base font-bold text-[#0d1f3c] md:text-lg">
                            {kartNumberLabel(kart.number)}
                          </span>
                          <span className="mt-0.5 block text-[12px] text-neutral-500">
                            {subtitle}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRequestDelete(kart);
                          }}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c41e3a]/20 text-[#c41e3a] transition hover:bg-red-50"
                          aria-label={`Excluir ${kartNumberLabel(kart.number)}`}
                        >
                          <HiTrash className="h-4 w-4" />
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
                          <KartAccordionFields
                            kart={kart}
                            showClientName={showClientName}
                            categoryOptions={categoryOptions}
                            onUpdate={(patch) => updateKart(kart.id, patch)}
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="rounded-xl border border-dashed border-[rgba(17,17,17,0.1)] bg-[#fafbfc] px-4 py-5 text-center text-sm text-neutral-500">
                Nenhum kart nesta categoria.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function KartsPanel({
  kartCategories,
  karts,
  onKartsChange,
  onDirty,
}: Props) {
  const [view, setView] = useState<View>("proprios");
  const [expandedKartId, setExpandedKartId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);

  const canConfigure = kartCategories.length > 0;
  const ownership = VIEW_OWNERSHIP[view];
  const showClientName = view === "clientes";

  const toggleKart = useCallback((kartId: string) => {
    setExpandedKartId((prev) => (prev === kartId ? null : kartId));
  }, []);

  const removeKart = (id: string) => {
    onKartsChange(karts.filter((k) => k.id !== id));
    setExpandedKartId((open) => (open === id ? null : open));
    onDirty();
  };

  const requestDelete = (kart: SettingsKartRow) => {
    const cat =
      kartCategories.find((c) => c.id === kart.categoryId)?.name ?? "—";
    const label = showClientName && kart.clientName.trim()
      ? `${kartNumberLabel(kart.number)} · ${kart.clientName.trim()}`
      : `${kartNumberLabel(kart.number)} · ${cat}`;
    setPendingDelete({ id: kart.id, label });
  };

  const viewToggle = (
    <div className="inline-flex flex-wrap rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] p-1">
      {(
        [
          ["proprios", "Karts próprios"],
          ["clientes", "Karts de clientes"],
        ] as const
      ).map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => {
            setView(key);
            setExpandedKartId(null);
          }}
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

  const viewDescription =
    view === "proprios"
      ? "Frota da equipe disponível para aluguel e aulas."
      : "Karts guardados na estrutura, de propriedade de pilotos ou equipes.";

  return (
    <SettingsSection
      title="Karts"
      description="Frota própria e karts de clientes, organizados por categoria."
      headerAction={viewToggle}
    >
      {!canConfigure ? (
        <p className="mb-6 rounded-xl border border-dashed border-amber-200/80 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          Cadastre categorias em <strong>Categorias e níveis</strong> antes de
          configurar a frota.
        </p>
      ) : null}

      <p className="mb-6 text-sm text-neutral-600">{viewDescription}</p>

      {kartCategories.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[rgba(17,17,17,0.12)] bg-[#fafbfc] px-4 py-6 text-center text-sm text-neutral-600">
          Cadastre categorias em <strong>Categorias e níveis</strong> para
          organizar os karts.
        </p>
      ) : (
        <KartListByCategory
          ownership={ownership}
          showClientName={showClientName}
          kartCategories={kartCategories}
          karts={karts}
          canConfigure={canConfigure}
          expandedKartId={expandedKartId}
          onToggleKart={toggleKart}
          onKartsChange={onKartsChange}
          onDirty={onDirty}
          onExpandKart={setExpandedKartId}
          onRequestDelete={requestDelete}
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Excluir kart?"
        message={
          pendingDelete
            ? `Excluir ${pendingDelete.label}? Esta ação não pode ser desfeita até salvar as alterações.`
            : ""
        }
        confirmLabel="Excluir"
        onConfirm={() => {
          if (pendingDelete) removeKart(pendingDelete.id);
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </SettingsSection>
  );
}
