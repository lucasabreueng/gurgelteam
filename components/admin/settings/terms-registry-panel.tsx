"use client";

import type {
  DreAccountTerm,
  FinancialCategoryTerm,
  InventoryPartCategoryTerm,
  RegisteredChassisTerm,
  RegisteredMotorTerm,
} from "@/lib/contracts/settings";

import { SettingsServiceMock } from "@/services/settings/settingsServiceMock";

import { useCallback, useMemo, useState } from "react";
import { HiChevronDown, HiPencil, HiPlus, HiTrash } from "react-icons/hi2";

import {
  adminAccordionItemClass,
  adminAccordionPanelClass,
  adminAccordionSubtitleClass,
  adminAccordionTitleClass,
  adminAccordionTriggerIconClass,
  adminAccentDashedRowClass,
  adminCardMutedClass,
  adminEditableRowClass,
  adminEmptyDashedClass,
  adminInlineRowClass,
  adminSegmentControlWrapClass,
  adminSegmentTabClass,
  adminTextAccentBoldClass,
  adminOutlineButtonClass,
} from "@/lib/design";
import { ConfirmDialog } from "./confirm-dialog";
import {
  SettingsField,
  SettingsSection,
  settingsInputClass,
  settingsOutlineButtonClass,
} from "./settings-section";

type Props = {
  dreAccounts: DreAccountTerm[];
  onDreAccountsChange: (rows: DreAccountTerm[]) => void;
  financialCategories: FinancialCategoryTerm[];
  onFinancialCategoriesChange: (rows: FinancialCategoryTerm[]) => void;
  inventoryPartCategories: InventoryPartCategoryTerm[];
  onInventoryPartCategoriesChange: (rows: InventoryPartCategoryTerm[]) => void;
  motors: RegisteredMotorTerm[];
  onMotorsChange: (rows: RegisteredMotorTerm[]) => void;
  chassis: RegisteredChassisTerm[];
  onChassisChange: (rows: RegisteredChassisTerm[]) => void;
  onDirty: () => void;
};

type View = "dre" | "financeiro" | "estoque" | "motores-chassi";

type FinanceView = "receitas" | "despesas";

type PendingDelete =
  | { type: "dre"; id: string; label: string }
  | { type: "finance"; id: string; label: string }
  | { type: "inventory"; id: string; label: string }
  | { type: "motor"; id: string; label: string }
  | { type: "chassis"; id: string; label: string }
  | null;

function DreLineRow({
  id,
  name,
  editing,
  onStartEdit,
  onFinishEdit,
  onChange,
  onDelete,
  canDelete,
}: {
  id: string;
  name: string;
  editing: boolean;
  onStartEdit: () => void;
  onFinishEdit: () => void;
  onChange: (value: string) => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  return (
    <li className={adminInlineRowClass}>
      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            id={id}
            className={`${settingsInputClass} w-full`}
            value={name}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") onFinishEdit();
            }}
          />
        ) : (
          <span className={`text-[14px] font-semibold ${adminTextAccentBoldClass}`}>{name}</span>
        )}
      </div>
      <button
        type="button"
        onMouseDown={(e) => {
          if (editing) e.preventDefault();
        }}
        onClick={() => (editing ? onFinishEdit() : onStartEdit())}
        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider ${adminOutlineButtonClass}`}
      >
        <HiPencil className="h-3 w-3" aria-hidden />
        {editing ? "Ok" : "Editar"}
      </button>
      {canDelete ? (
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-1 rounded-lg border border-[#c41e3a]/25 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#c41e3a]"
        >
          <HiTrash className="h-3 w-3" aria-hidden />
          Remover
        </button>
      ) : null}
    </li>
  );
}

function DreGroupAccordion({
  group,
  lines,
  expanded,
  onToggle,
  editingId,
  onStartEdit,
  onFinishEdit,
  onLineChange,
  onRequestDelete,
  onAddLine,
}: {
  group: DreAccountTerm;
  lines: DreAccountTerm[];
  expanded: boolean;
  onToggle: () => void;
  editingId: string | null;
  onStartEdit: (id: string) => void;
  onFinishEdit: () => void;
  onLineChange: (id: string, label: string) => void;
  onRequestDelete: (line: DreAccountTerm) => void;
  onAddLine: () => void;
}) {
  const panelId = `dre-group-panel-${group.id}`;
  const triggerId = `dre-group-trigger-${group.id}`;

  return (
    <li className={adminAccordionItemClass(expanded, { overflowVisible: true })}>
      <div className="flex items-center gap-2 px-3 py-3 md:px-4 md:py-4">
        <button
          id={triggerId}
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={onToggle}
          className={adminAccordionTriggerIconClass(expanded)}
          aria-label={expanded ? "Recolher grupo" : "Expandir grupo"}
        >
          <HiChevronDown
            className={`h-5 w-5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
        <button type="button" className="min-w-0 flex-1 text-left" onClick={onToggle}>
          <span className={`block ${adminAccordionTitleClass}`}>
            {group.label}
          </span>
          <span className={adminAccordionSubtitleClass}>
            {lines.length} {lines.length === 1 ? "conta" : "contas"} · Grupo fixo
          </span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddLine();
          }}
          className={`${settingsOutlineButtonClass} shrink-0`}
        >
          <HiPlus className="h-3.5 w-3.5" aria-hidden />
          Adicionar conta
        </button>
      </div>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!expanded}
        className={expanded ? "block" : "hidden"}
      >
        <div className={`md:pb-6 ${adminAccordionPanelClass}`}>
          {lines.length > 0 ? (
            <ul className="space-y-2">
              {lines.map((line) => (
                <DreLineRow
                  key={line.id}
                  id={`dre-${line.id}`}
                  name={line.label}
                  editing={editingId === line.id}
                  onStartEdit={() => onStartEdit(line.id)}
                  onFinishEdit={onFinishEdit}
                  onChange={(label) => onLineChange(line.id, label)}
                  onDelete={() => onRequestDelete(line)}
                  canDelete
                />
              ))}
            </ul>
          ) : (
            <p className={adminEmptyDashedClass}>
              Nenhuma conta neste grupo.
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

function RegistryTermsAccordion<T extends { id: string; name: string }>({
  sectionId,
  title,
  description,
  addLabel,
  items,
  editKeyPrefix,
  expanded,
  onToggle,
  editingId,
  onStartEdit,
  onFinishEdit,
  onItemChange,
  onRequestDelete,
  onAdd,
  canDeleteItem,
  emptyLabel,
}: {
  sectionId: string;
  title: string;
  description: string;
  addLabel: string;
  items: T[];
  editKeyPrefix: string;
  expanded: boolean;
  onToggle: () => void;
  editingId: string | null;
  onStartEdit: (key: string) => void;
  onFinishEdit: () => void;
  onItemChange: (id: string, name: string) => void;
  onRequestDelete: (item: T) => void;
  onAdd: () => void;
  canDeleteItem: boolean;
  emptyLabel: string;
}) {
  const panelId = `terms-panel-${sectionId}`;
  const triggerId = `terms-trigger-${sectionId}`;

  return (
    <li className={adminAccordionItemClass(expanded, { overflowVisible: true })}>
      <div className="flex items-center gap-2 px-3 py-3 md:px-4 md:py-4">
        <button
          id={triggerId}
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={onToggle}
          className={adminAccordionTriggerIconClass(expanded)}
          aria-label={expanded ? "Recolher seção" : "Expandir seção"}
        >
          <HiChevronDown
            className={`h-5 w-5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
        <button type="button" className="min-w-0 flex-1 text-left" onClick={onToggle}>
          <span className={`block ${adminAccordionTitleClass}`}>{title}</span>
          <span className={adminAccordionSubtitleClass}>
            {items.length} {items.length === 1 ? "item" : "itens"} · {description}
          </span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          className={`${settingsOutlineButtonClass} shrink-0`}
        >
          <HiPlus className="h-3.5 w-3.5" aria-hidden />
          {addLabel}
        </button>
      </div>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!expanded}
        className={expanded ? "block" : "hidden"}
      >
        <div className={`md:pb-6 ${adminAccordionPanelClass}`}>
          {items.length > 0 ? (
            <ul className="space-y-2">
              {items.map((item) => {
                const editKey = `${editKeyPrefix}${item.id}`;
                const isEditing = editingId === editKey;
                return (
                  <EditableNameRow
                    key={item.id}
                    id={editKey}
                    name={item.name}
                    editing={isEditing}
                    onStartEdit={() => onStartEdit(editKey)}
                    onFinishEdit={onFinishEdit}
                    onChange={(name) => onItemChange(item.id, name)}
                    onDelete={() => onRequestDelete(item)}
                    canDelete={canDeleteItem}
                  />
                );
              })}
            </ul>
          ) : (
            <p className={adminEmptyDashedClass}>
              {emptyLabel}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

function EditableNameRow({
  id,
  name,
  editing,
  onStartEdit,
  onFinishEdit,
  onChange,
  onDelete,
  canDelete,
  meta,
  indent = 0,
}: {
  id: string;
  name: string;
  editing: boolean;
  onStartEdit: () => void;
  onFinishEdit: () => void;
  onChange: (value: string) => void;
  onDelete: () => void;
  canDelete: boolean;
  meta?: string;
  indent?: number;
}) {
  return (
    <li
      className={adminEditableRowClass}
      style={indent > 0 ? { marginLeft: `${indent * 16}px` } : undefined}
    >
      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            id={id}
            className={`${settingsInputClass} w-full`}
            value={name}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") onFinishEdit();
            }}
          />
        ) : (
          <>
            <span className={`block text-base font-bold ${adminTextAccentBoldClass}`}>{name}</span>
            {meta ? (
              <span className="mt-0.5 block text-[11px] font-medium text-[var(--ds-text-muted)]">
                {meta}
              </span>
            ) : null}
          </>
        )}
      </div>
      <button
        type="button"
        onMouseDown={(e) => {
          if (editing) e.preventDefault();
        }}
        onClick={() => (editing ? onFinishEdit() : onStartEdit())}
        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-wider ${adminOutlineButtonClass}`}
      >
        <HiPencil className="h-3.5 w-3.5" aria-hidden />
        {editing ? "Concluir" : "Editar"}
      </button>
      {canDelete ? (
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#c41e3a]/25 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#c41e3a]"
        >
          <HiTrash className="h-3.5 w-3.5" aria-hidden />
          Remover
        </button>
      ) : null}
    </li>
  );
}

export function TermsRegistryPanel({
  dreAccounts,
  onDreAccountsChange,
  financialCategories,
  onFinancialCategoriesChange,
  inventoryPartCategories,
  onInventoryPartCategoriesChange,
  motors,
  onMotorsChange,
  chassis,
  onChassisChange,
  onDirty,
}: Props) {
  const [view, setView] = useState<View>("dre");
  const [financeView, setFinanceView] = useState<FinanceView>("receitas");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);
  const [expandedDreGroups, setExpandedDreGroups] = useState<Record<string, boolean>>({});
  const [expandedTermSections, setExpandedTermSections] = useState<
    Partial<Record<"motors" | "chassis", boolean>>
  >({});

  const isTermSectionExpanded = useCallback(
    (key: "motors" | "chassis") => expandedTermSections[key] ?? true,
    [expandedTermSections],
  );

  const toggleTermSection = useCallback((key: "motors" | "chassis") => {
    setExpandedTermSections((prev) => ({
      ...prev,
      [key]: !(prev[key] ?? true),
    }));
  }, []);

  const dreSections = useMemo(
    () => SettingsServiceMock.buildDreSections(dreAccounts),
    [dreAccounts],
  );

  const isDreGroupExpanded = useCallback(
    (groupId: string) => expandedDreGroups[groupId] ?? true,
    [expandedDreGroups],
  );

  const toggleDreGroup = useCallback((groupId: string) => {
    setExpandedDreGroups((prev) => ({
      ...prev,
      [groupId]: !(prev[groupId] ?? true),
    }));
  }, []);

  const touch = useCallback(() => onDirty(), [onDirty]);

  const viewToggle = (
    <div className={`max-w-full flex-wrap ${adminSegmentControlWrapClass}`}>
      {(
        [
          ["dre", "Contas DRE"],
          ["financeiro", "Receitas e despesas"],
          ["estoque", "Peças"],
          ["motores-chassi", "Motores e chassi"],
        ] as const
      ).map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => {
            setView(key);
            setEditingId(null);
          }}
          className={`rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wider sm:px-4 sm:text-[11px] ${adminSegmentTabClass(view === key)}`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  const renderDre = () => (
    <div className="space-y-4">
      <div>
        <p className="text-[12px] font-bold uppercase tracking-wider text-neutral-500">
          Plano de contas do DRE
        </p>
        <p className="mt-1 text-sm text-neutral-600">
          Grupos e resultados são fixos. Dentro de cada grupo, adicione ou edite as contas
          analíticas usadas no demonstrativo de resultados.
        </p>
      </div>

      <ul className="space-y-3">
        {dreSections.map((section) => {
          if (section.type === "group") {
            return (
              <DreGroupAccordion
                key={section.group.id}
                group={section.group}
                lines={section.lines}
                expanded={isDreGroupExpanded(section.group.id)}
                onToggle={() => toggleDreGroup(section.group.id)}
                editingId={editingId}
                onStartEdit={setEditingId}
                onFinishEdit={() => setEditingId(null)}
                onLineChange={(id, label) => {
                  onDreAccountsChange(
                    dreAccounts.map((a) => (a.id === id ? { ...a, label } : a)),
                  );
                  touch();
                }}
                onRequestDelete={(line) =>
                  setPendingDelete({ type: "dre", id: line.id, label: line.label })
                }
                onAddLine={() => {
                  const created = SettingsServiceMock.createDreAccountLine(
                    dreAccounts,
                    section.group.id,
                  );
                  onDreAccountsChange(
                    SettingsServiceMock.insertDreLineInGroup(
                      dreAccounts,
                      section.group.id,
                      created,
                    ),
                  );
                  setExpandedDreGroups((prev) => ({ ...prev, [section.group.id]: true }));
                  setEditingId(created.id);
                  touch();
                }}
              />
            );
          }

          if (section.type === "standalone") {
            return (
              <li
                key={section.line.id}
                className={`flex items-center justify-between gap-3 px-4 py-3 ${adminInlineRowClass}`}
              >
                <span className={`text-[14px] font-semibold ${adminTextAccentBoldClass}`}>
                  {section.line.label}
                </span>
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-[var(--ds-text-muted)]">
                  Conta fixa
                </span>
              </li>
            );
          }

          return (
            <li
              key={section.row.id}
              className={`flex items-center justify-between gap-3 ${adminAccentDashedRowClass}`}
            >
              <span className={`text-[15px] font-bold ${adminTextAccentBoldClass}`}>
                {section.row.label}
              </span>
              <span className="shrink-0 rounded-lg bg-[var(--ds-bg-elevated)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                Resultado
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const financeRows = financialCategories.filter((c) =>
    c.flow === (financeView === "receitas" ? "revenue" : "expense"),
  );

  const renderFinance = () => (
    <div className="space-y-6">
      <div className={adminSegmentControlWrapClass}>
        {(
          [
            ["receitas", "Receitas"],
            ["despesas", "Despesas"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setFinanceView(key);
              setEditingId(null);
            }}
            className={`rounded-lg px-4 py-2 text-[11px] font-bold uppercase tracking-wider ${adminSegmentTabClass(financeView === key)}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-600">
          Categorias usadas em lançamentos financeiros, contas a pagar/receber e relatórios.
        </p>
        <button
          type="button"
          onClick={() => {
            const created = SettingsServiceMock.createFinancialCategory(
              financeView === "receitas" ? "revenue" : "expense",
            );
            onFinancialCategoriesChange([...financialCategories, created]);
            setEditingId(created.id);
            touch();
          }}
          className={settingsOutlineButtonClass}
        >
          <HiPlus className="h-3.5 w-3.5" aria-hidden />
          {financeView === "receitas" ? "Nova receita" : "Nova despesa"}
        </button>
      </div>

      <ul className="space-y-3">
        {financeRows.map((row) => {
          const isEditing = editingId === row.id;
          return (
            <EditableNameRow
              key={row.id}
              id={`fin-${row.id}`}
              name={row.name}
              editing={isEditing}
              onStartEdit={() => setEditingId(row.id)}
              onFinishEdit={() => setEditingId(null)}
              onChange={(name) => {
                onFinancialCategoriesChange(
                  financialCategories.map((c) => (c.id === row.id ? { ...c, name } : c)),
                );
                touch();
              }}
              onDelete={() =>
                setPendingDelete({ type: "finance", id: row.id, label: row.name })
              }
              canDelete={financeRows.length > 1}
              meta={row.group ? `Grupo: ${row.group}` : undefined}
            />
          );
        })}
      </ul>

      {financeView === "despesas" ? (
        <div className={adminCardMutedClass}>
          <SettingsField label="Grupo da categoria (despesas)">
            <p className="text-[12px] text-[var(--ds-text-secondary)]">
              Ao editar uma despesa, o grupo padrão é &quot;Operacionais&quot; ou
              &quot;Administrativas&quot; conforme o cadastro inicial. Grupos customizados podem
              ser definidos ao salvar no backend.
            </p>
          </SettingsField>
        </div>
      ) : null}
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-wider text-neutral-500">
            Categorias de peças
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            Classificação do catálogo de estoque e movimentações de peças.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const created = SettingsServiceMock.createInventoryPartCategory();
            onInventoryPartCategoriesChange([...inventoryPartCategories, created]);
            setEditingId(created.id);
            touch();
          }}
          className={settingsOutlineButtonClass}
        >
          <HiPlus className="h-3.5 w-3.5" aria-hidden />
          Nova categoria
        </button>
      </div>

      <ul className="space-y-3">
        {inventoryPartCategories.map((row) => {
          const isEditing = editingId === row.id;
          return (
            <EditableNameRow
              key={row.id}
              id={`inv-${row.id}`}
              name={row.name}
              editing={isEditing}
              onStartEdit={() => setEditingId(row.id)}
              onFinishEdit={() => setEditingId(null)}
              onChange={(name) => {
                onInventoryPartCategoriesChange(
                  inventoryPartCategories.map((c) =>
                    c.id === row.id ? { ...c, name } : c,
                  ),
                );
                touch();
              }}
              onDelete={() =>
                setPendingDelete({ type: "inventory", id: row.id, label: row.name })
              }
              canDelete={inventoryPartCategories.length > 1}
            />
          );
        })}
      </ul>
    </div>
  );

  const renderMotorsChassis = () => (
    <ul className="space-y-3">
      <RegistryTermsAccordion
        sectionId="motors"
        title="Motores"
        description="Cadastro para frota e manutenção"
        addLabel="Novo motor"
        items={motors}
        editKeyPrefix="motor-"
        expanded={isTermSectionExpanded("motors")}
        onToggle={() => toggleTermSection("motors")}
        editingId={editingId}
        onStartEdit={setEditingId}
        onFinishEdit={() => setEditingId(null)}
        onItemChange={(id, name) => {
          onMotorsChange(motors.map((m) => (m.id === id ? { ...m, name } : m)));
          touch();
        }}
        onRequestDelete={(item) =>
          setPendingDelete({ type: "motor", id: item.id, label: item.name })
        }
        onAdd={() => {
          const created = SettingsServiceMock.createRegisteredMotor();
          onMotorsChange([...motors, created]);
          setExpandedTermSections((prev) => ({ ...prev, motors: true }));
          setEditingId(`motor-${created.id}`);
          touch();
        }}
        canDeleteItem={motors.length > 1}
        emptyLabel="Nenhum motor cadastrado."
      />
      <RegistryTermsAccordion
        sectionId="chassis"
        title="Chassi"
        description="Marcas e modelos na frota"
        addLabel="Novo chassi"
        items={chassis}
        editKeyPrefix="chassis-"
        expanded={isTermSectionExpanded("chassis")}
        onToggle={() => toggleTermSection("chassis")}
        editingId={editingId}
        onStartEdit={setEditingId}
        onFinishEdit={() => setEditingId(null)}
        onItemChange={(id, name) => {
          onChassisChange(chassis.map((c) => (c.id === id ? { ...c, name } : c)));
          touch();
        }}
        onRequestDelete={(item) =>
          setPendingDelete({ type: "chassis", id: item.id, label: item.name })
        }
        onAdd={() => {
          const created = SettingsServiceMock.createRegisteredChassis();
          onChassisChange([...chassis, created]);
          setExpandedTermSections((prev) => ({ ...prev, chassis: true }));
          setEditingId(`chassis-${created.id}`);
          touch();
        }}
        canDeleteItem={chassis.length > 1}
        emptyLabel="Nenhum chassi cadastrado."
      />
    </ul>
  );

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    switch (pendingDelete.type) {
      case "dre":
        onDreAccountsChange(dreAccounts.filter((a) => a.id !== pendingDelete.id));
        break;
      case "finance":
        onFinancialCategoriesChange(
          financialCategories.filter((c) => c.id !== pendingDelete.id),
        );
        break;
      case "inventory":
        onInventoryPartCategoriesChange(
          inventoryPartCategories.filter((c) => c.id !== pendingDelete.id),
        );
        break;
      case "motor":
        onMotorsChange(motors.filter((m) => m.id !== pendingDelete.id));
        break;
      case "chassis":
        onChassisChange(chassis.filter((c) => c.id !== pendingDelete.id));
        break;
    }
    if (editingId?.includes(pendingDelete.id)) setEditingId(null);
    touch();
    setPendingDelete(null);
  };

  return (
    <SettingsSection
      title="Cadastro de termos"
      description="Termos de referência usados no financeiro, estoque, DRE e cadastro de karts."
      headerAction={viewToggle}
    >
      {view === "dre" ? renderDre() : null}
      {view === "financeiro" ? renderFinance() : null}
      {view === "estoque" ? renderInventory() : null}
      {view === "motores-chassi" ? renderMotorsChassis() : null}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Remover termo?"
        message={
          pendingDelete
            ? `Remover "${pendingDelete.label}"? Esta ação só será definitiva após salvar as configurações.`
            : ""
        }
        confirmLabel="Remover"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </SettingsSection>
  );
}
