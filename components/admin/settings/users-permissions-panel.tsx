"use client";

import {
  MODULE_GROUPS,
  MODULE_LABELS,
  type ModuleKey,
  type ModulePermissionSet,
  type SettingsUserAccount,
} from "@/lib/contracts/settings";
import { SettingsServiceMock } from "@/services/settings/settingsServiceMock";
import { useCallback, useState } from "react";
import { HiChevronDown, HiPencil, HiPlus, HiTrash } from "react-icons/hi2";
import { ConfirmDialog } from "./confirm-dialog";
import { SettingsPromptDialog } from "./settings-prompt-dialog";
import { SettingsSection } from "./settings-section";

type PermColumn = keyof ModulePermissionSet | "todos";

const userIconActionClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition";

function isAllSelected(set: ModulePermissionSet): boolean {
  return set.visualizar && set.editar && set.excluir;
}

function PermissionsTable({
  moduleKeys,
  activeUser,
  onPermChange,
}: {
  moduleKeys: ModuleKey[];
  activeUser: SettingsUserAccount;
  onPermChange: (
    moduleKey: ModuleKey,
    column: PermColumn,
    checked: boolean,
  ) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[rgba(17,17,17,0.08)]">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc] text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            <th className="px-4 py-3">Módulo</th>
            <th className="px-3 py-3 text-center">Visualizar</th>
            <th className="px-3 py-3 text-center">Editar</th>
            <th className="px-3 py-3 text-center">Excluir</th>
            <th className="px-3 py-3 text-center">Todos</th>
          </tr>
        </thead>
        <tbody>
          {moduleKeys.map((moduleKey) => {
            const perms = activeUser.modules[moduleKey];
            const allOn = isAllSelected(perms);
            return (
              <tr
                key={moduleKey}
                className="border-b border-[rgba(17,17,17,0.05)] last:border-0"
              >
                <td className="px-4 py-3 font-medium text-[#0d1f3c]">
                  {MODULE_LABELS[moduleKey]}
                </td>
                {(
                  ["visualizar", "editar", "excluir", "todos"] as PermColumn[]
                ).map((col) => (
                  <td key={col} className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={col === "todos" ? allOn : perms[col]}
                      onChange={(e) =>
                        onPermChange(moduleKey, col, e.target.checked)
                      }
                      className="h-4 w-4 cursor-pointer rounded border-neutral-300 accent-[#0d1f3c]"
                      aria-label={`${MODULE_LABELS[moduleKey]} — ${col}`}
                    />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

type Props = {
  users: SettingsUserAccount[];
  onUsersChange: (users: SettingsUserAccount[]) => void;
  onDirty: () => void;
};

export function UsersPermissionsPanel({
  users,
  onUsersChange,
  onDirty,
}: Props) {
  const [activeUserId, setActiveUserId] = useState(users[0]?.id ?? "");
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>("admin");

  const touch = useCallback(() => onDirty(), [onDirty]);

  const activeUser =
    users.find((u) => u.id === activeUserId) ?? users[0] ?? null;

  const editingUser = users.find((u) => u.id === editUserId) ?? null;

  const updateModulePerm = (
    userId: string,
    moduleKey: ModuleKey,
    column: PermColumn,
    checked: boolean,
  ) => {
    onUsersChange(
      users.map((u) => {
        if (u.id !== userId) return u;
        const current = u.modules[moduleKey];
        let next: ModulePermissionSet;
        if (column === "todos") {
          next = {
            visualizar: checked,
            editar: checked,
            excluir: checked,
          };
        } else {
          next = { ...current, [column]: checked };
        }
        return {
          ...u,
          modules: { ...u.modules, [moduleKey]: next },
        };
      }),
    );
    touch();
  };

  const addUser = () => {
    const created = SettingsServiceMock.createSettingsUser();
    onUsersChange([...users, created]);
    setActiveUserId(created.id);
    setEditUserId(created.id);
    touch();
  };

  const removeUser = (userId: string) => {
    const next = users.filter((u) => u.id !== userId);
    onUsersChange(next);
    if (activeUserId === userId) {
      setActiveUserId(next[0]?.id ?? "");
    }
    setPendingRemoveId(null);
    touch();
  };

  const saveUserName = useCallback(
    (name: string) => {
      if (!editUserId) return;
      onUsersChange(
        users.map((u) => (u.id === editUserId ? { ...u, name } : u)),
      );
      setEditUserId(null);
      touch();
    },
    [editUserId, onUsersChange, touch, users],
  );

  const toggleGroup = (groupKey: string) => {
    setExpandedGroup((prev) => (prev === groupKey ? null : groupKey));
  };

  return (
    <SettingsSection
      title="Usuários e permissões"
      description="Gerencie contas e defina o que cada usuário pode fazer em cada módulo."
    >
      <div className="flex items-center gap-2">
        <div className="settings-user-tabs-scroll flex min-w-0 flex-1 items-center gap-2 overflow-x-auto scroll-px-1 py-1 app-scrollbar-hidden">
          {users.map((user) => {
            const isActive = user.id === activeUser?.id;
            return (
              <button
                key={user.id}
                type="button"
                onClick={() => setActiveUserId(user.id)}
                className={`shrink-0 rounded-xl border px-4 py-2.5 text-[12px] font-bold transition ${
                  isActive
                    ? "border-transparent bg-[#0d1f3c] text-white"
                    : "border-[rgba(17,17,17,0.1)] bg-white text-neutral-600 hover:border-accent/30"
                }`}
              >
                {user.name || "Sem nome"}
              </button>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 border-l border-[rgba(17,17,17,0.08)] pl-2">
          <button
            type="button"
            onClick={addUser}
            className={`${userIconActionClass} border-dashed border-[rgba(13,31,60,0.25)] bg-white text-[#0d1f3c] hover:border-accent/40`}
            aria-label="Adicionar usuário"
            title="Adicionar usuário"
          >
            <HiPlus className="h-4 w-4" aria-hidden />
          </button>
          {activeUser ? (
            <button
              type="button"
              onClick={() => setEditUserId(activeUser.id)}
              className={`${userIconActionClass} border-[rgba(13,31,60,0.12)] bg-white text-[#0d1f3c] hover:border-accent/30`}
              aria-label="Editar usuário selecionado"
              title="Editar usuário"
            >
              <HiPencil className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
          {users.length > 1 && activeUser ? (
            <button
              type="button"
              onClick={() => setPendingRemoveId(activeUser.id)}
              className={`${userIconActionClass} border-red-200 bg-red-50 text-red-700 hover:bg-red-100`}
              aria-label="Remover usuário selecionado"
              title="Remover usuário"
            >
              <HiTrash className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>

      {activeUser ? (
        <ul className="mt-8 space-y-3" role="list">
          {MODULE_GROUPS.map((group) => {
            const isOpen = expandedGroup === group.key;
            const panelId = `perm-group-${group.key}`;
            const triggerId = `perm-trigger-${group.key}`;

            return (
              <li
                key={group.key}
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
                  onClick={() => toggleGroup(group.key)}
                  className="flex w-full items-center gap-3 px-4 py-4 text-left"
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
                  <span className="text-base font-bold text-[#0d1f3c] md:text-lg">
                    {group.label}
                  </span>
                  <span className="ml-auto text-[12px] text-neutral-500">
                    {group.moduleKeys.length} módulos
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  hidden={!isOpen}
                  className={isOpen ? "block" : "hidden"}
                >
                  <div className="border-t border-[rgba(17,17,17,0.08)] px-4 pb-5 pt-4 md:px-5">
                    <PermissionsTable
                      moduleKeys={group.moduleKeys}
                      activeUser={activeUser}
                      onPermChange={(moduleKey, column, checked) =>
                        updateModulePerm(
                          activeUser.id,
                          moduleKey,
                          column,
                          checked,
                        )
                      }
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-neutral-500">
          Nenhum usuário cadastrado. Use o ícone de adicionar para criar um.
        </p>
      )}

      <SettingsPromptDialog
        open={editUserId !== null}
        title="Editar usuário"
        label="Nome do usuário"
        initialValue={editingUser?.name ?? ""}
        confirmLabel="Salvar"
        onConfirm={saveUserName}
        onCancel={() => setEditUserId(null)}
      />

      <ConfirmDialog
        open={pendingRemoveId !== null}
        title="Remover usuário?"
        message="Tem certeza que deseja remover este usuário? As permissões associadas serão perdidas."
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        onConfirm={() => {
          if (pendingRemoveId) removeUser(pendingRemoveId);
        }}
        onCancel={() => setPendingRemoveId(null)}
      />
    </SettingsSection>
  );
}
