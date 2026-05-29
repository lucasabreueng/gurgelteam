"use client";

import { ClientsServiceMock } from "@/services/clients/clientsServiceMock";
import type { ClientStatus, ClientListItem } from "@/lib/contracts/clients";
import type { KartCategory, SkillLevel } from "@/lib/contracts/settings";
import { useDrawerBodyLock } from "@/lib/hooks/use-drawer-body-lock";
import { useEffect, useMemo, useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { SettingsCheckbox } from "../settings/settings-checkbox";
import { SettingsDropdown } from "../settings/settings-dropdown";
import { SettingsField } from "../settings/settings-section";
import {
  DRAWER_FOOTER_INNER_CLASS,
  DRAWER_FOOTER_SHELL_CLASS,
  DrawerFooterActions,
} from "@/components/ui/drawer-footer";

type Patch = {
  categoryIds: string[];
  levelId: string;
  status: ClientStatus;
};

type Props = {
  clientId: string | null;
  categories: KartCategory[];
  skillLevels: SkillLevel[];
  onClose: () => void;
  /** Persiste o patch na página (mock). */
  onSave: (clientId: string, patch: Patch) => void;
  /** Lista atual (já com overrides) pra preencher defaults. */
  getClient: (id: string) => ClientListItem | null;
};

export function ClientEditDrawer({
  clientId,
  categories,
  skillLevels,
  onClose,
  onSave,
  getClient,
}: Props) {
  useDrawerBodyLock(Boolean(clientId));

  const client = clientId ? getClient(clientId) : null;

  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [levelId, setLevelId] = useState<string>("");
  const [status, setStatus] = useState<ClientStatus>("Ativo");

  useEffect(() => {
    if (!clientId || !client) return;
    setCategoryIds(client.categoryIds);
    setLevelId(client.levelId);
    setStatus(client.status);
  }, [clientId, client]);

  useEffect(() => {
    if (!clientId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clientId, onClose]);

  const statusOptions = useMemo(
    () => ClientsServiceMock.getFilterStatuses().map((s) => ({ value: s, label: s })),
    []
  );

  const levelOptions = useMemo(
    () => [
      { value: "", label: "Selecione o nível…" },
      ...skillLevels.map((l) => ({ value: l.id, label: l.name })),
    ],
    [skillLevels]
  );

  const canSave =
    Boolean(clientId) &&
    categoryIds.length > 0 &&
    levelId.trim().length > 0 &&
    status.trim().length > 0;

  const toggleCategory = (id: string) => {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  if (!clientId || !client) return null;

  return (
    <div className="fixed inset-0 z-[230] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Fechar edição"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-edit-title"
        className="app-drawer-panel relative flex h-full w-full max-w-full flex-col bg-[#f3f5f9] shadow-2xl lg:max-w-[min(520px,92vw)]"
      >
        <header className="shrink-0 border-b border-[rgba(17,17,17,0.08)] bg-white px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 id="client-edit-title" className="truncate text-xl font-bold text-[#0d1f3c]">
                Editar cliente
              </h1>
              <p className="mt-1 truncate text-sm text-neutral-600">{client.name}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-neutral-500 hover:bg-neutral-100"
              aria-label="Fechar"
            >
              <HiXMark className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="space-y-4 rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
            <SettingsField label="Categoria">
              <ul className="space-y-2">
                {categories.map((category) => {
                  const checked = categoryIds.includes(category.id);
                  return (
                    <li key={category.id}>
                      <div
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition ${
                          checked
                            ? "border-accent/30 bg-[rgba(13,31,60,0.04)]"
                            : "border-[rgba(17,17,17,0.1)] bg-[#fafbfc] hover:border-accent/25"
                        }`}
                      >
                        <SettingsCheckbox
                          checked={checked}
                          onChange={() => toggleCategory(category.id)}
                          aria-label={category.name}
                        />
                        <button
                          type="button"
                          onClick={() => toggleCategory(category.id)}
                          className="min-w-0 flex-1 text-left text-[14px] font-medium text-[#111]"
                        >
                          {category.name}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </SettingsField>

            <SettingsField label="Nível">
              <SettingsDropdown
                aria-label="Nível do piloto"
                options={levelOptions}
                value={levelId}
                onSelect={setLevelId}
              />
            </SettingsField>

            <SettingsField label="Status">
              <SettingsDropdown
                aria-label="Status do cliente"
                options={statusOptions}
                value={status}
                onSelect={(value) => setStatus(value as ClientStatus)}
              />
            </SettingsField>
          </div>
        </div>

        <footer className={DRAWER_FOOTER_SHELL_CLASS}>
          <div className={DRAWER_FOOTER_INNER_CLASS}>
            <DrawerFooterActions columns={2}>
              <button
                type="button"
                onClick={onClose}
                className="btn-outline-md bg-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!canSave}
                onClick={() => onSave(clientId, { categoryIds, levelId, status })}
                className="btn-primary-md disabled:opacity-50"
              >
                Salvar alterações
              </button>
            </DrawerFooterActions>
          </div>
        </footer>
      </aside>
    </div>
  );
}

