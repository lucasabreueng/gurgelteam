"use client";



import {

  MODULE_GROUPS,

  MODULE_LABELS,

  type ModuleKey,

  type ModulePermissionSet,

  type SettingsUserAccount,

} from "@/lib/contracts/settings";

import { getAppServices } from "@/lib/data-source/app-services";

import { isBuiltInPermissionProfileId } from "@/lib/settings/built-in-profile-ids";

import { SettingsServiceMock } from "@/services/settings/settingsServiceMock";

import {

  adminAccordionItemClass,

  adminAccordionMetaClass,

  adminAccordionPanelClass,

  adminAccordionTitleClass,

  adminAccordionTriggerIconClass,

  adminAccordionTriggerRowClass,

  adminIconButtonClass,

  adminSettingsProfileTabActiveClass,

  adminSettingsProfileTabClass,

  adminTableHeadRowClass,

  adminTextAccentBoldClass,

} from "@/lib/design";

import { useCallback, useState } from "react";

import { HiChevronDown, HiPencil, HiPlus, HiTrash } from "react-icons/hi2";

import { ConfirmDialog } from "./confirm-dialog";

import { SettingsCheckbox } from "./settings-checkbox";

import { SettingsPromptDialog } from "./settings-prompt-dialog";

import { SettingsSection } from "./settings-section";



type PermColumn = keyof ModulePermissionSet | "todos";



const userIconActionClass = `${adminIconButtonClass} h-10 w-10 shrink-0`;



function isAllSelected(set: ModulePermissionSet): boolean {

  return set.visualizar && set.editar && set.excluir;

}



function PermissionsTable({

  moduleKeys,

  activeUser,

  onPermChange,

}: {

  moduleKeys: readonly ModuleKey[];

  activeUser: SettingsUserAccount;

  onPermChange: (

    moduleKey: ModuleKey,

    column: PermColumn,

    checked: boolean,

  ) => void;

}) {

  return (

    <div className="overflow-x-auto rounded-xl border border-[var(--ds-border)]">

      <table className="w-full min-w-[560px] text-left text-sm">

        <thead>

          <tr className={adminTableHeadRowClass}>

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

                className="border-b border-[var(--ds-border-subtle)] last:border-0"

              >

                <td className={`px-4 py-3 font-medium ${adminTextAccentBoldClass}`}>

                  {MODULE_LABELS[moduleKey]}

                </td>

                {(

                  ["visualizar", "editar", "excluir", "todos"] as PermColumn[]

                ).map((col) => (

                  <td key={col} className="px-3 py-3">

                    <div className="flex justify-center">

                      <SettingsCheckbox

                        checked={col === "todos" ? allOn : perms[col]}

                        onChange={(checked) =>

                          onPermChange(moduleKey, col, checked)

                        }

                        aria-label={`${MODULE_LABELS[moduleKey]} — ${col}`}

                      />

                    </div>

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

  const [blockedRemoveMessage, setBlockedRemoveMessage] = useState<

    string | null

  >(null);

  const [checkingRemove, setCheckingRemove] = useState(false);

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



  const formatAssigneesBlockedMessage = (

    profileName: string,

    assignees: { name: string; email: string }[],

  ) => {

    const list = assignees.map((a) => `• ${a.name} (${a.email})`).join("\n");

    const who =

      assignees.length === 1

        ? "existe 1 usuário vinculado"

        : `existem ${assignees.length} usuários vinculados`;

    const hint =

      assignees.length === 1

        ? "Altere a função desse usuário em Equipe"

        : "Altere a função desses usuários em Equipe";

    return `Não é possível remover o perfil "${profileName}" porque ${who} a ele:\n\n${list}\n\n${hint} antes de remover o perfil.`;

  };



  const requestRemoveProfile = useCallback(

    async (profile: SettingsUserAccount) => {

      if (isBuiltInPermissionProfileId(profile.id)) {

        setBlockedRemoveMessage(

          `Não é possível remover o perfil "${profile.name}" porque é um perfil padrão do sistema.`,

        );

        return;

      }



      setCheckingRemove(true);

      try {

        const assignees = await getAppServices().settings.getProfileAssignees(

          profile.id,

        );

        if (assignees.length > 0) {

          setBlockedRemoveMessage(

            formatAssigneesBlockedMessage(profile.name, assignees),

          );

          return;

        }

        setPendingRemoveId(profile.id);

      } catch (error) {

        const detail =

          error instanceof Error ? error.message : "Erro desconhecido";

        setBlockedRemoveMessage(

          `Não foi possível verificar os usuários vinculados a este perfil.\n\n${detail}`,

        );

      } finally {

        setCheckingRemove(false);

      }

    },

    [],

  );



  return (

    <SettingsSection

      title="Usuários e permissões"

      description="Defina o que cada perfil (Administrador, Financeiro, Piloto, etc.) pode fazer em cada módulo. Alterações aplicam-se às contas vinculadas a esse perfil."

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

                className={

                  isActive

                    ? adminSettingsProfileTabActiveClass

                    : adminSettingsProfileTabClass

                }

              >

                {user.name || "Sem nome"}

              </button>

            );

          })}

        </div>



        <div className="flex shrink-0 items-center gap-1.5 border-l border-[var(--ds-border)] pl-2">

          <button

            type="button"

            onClick={addUser}

            className={`${userIconActionClass} border-dashed border-[var(--ds-border-field)] text-[var(--ds-text-primary)] hover:border-accent/40`}

            aria-label="Adicionar usuário"

            title="Adicionar usuário"

          >

            <HiPlus className="h-4 w-4" aria-hidden />

          </button>

          {activeUser ? (

            <button

              type="button"

              onClick={() => setEditUserId(activeUser.id)}

              className={userIconActionClass}

              aria-label="Editar usuário selecionado"

              title="Editar usuário"

            >

              <HiPencil className="h-4 w-4" aria-hidden />

            </button>

          ) : null}

          {users.length > 1 &&

          activeUser &&

          !isBuiltInPermissionProfileId(activeUser.id) ? (

            <button

              type="button"

              disabled={checkingRemove}

              onClick={() => void requestRemoveProfile(activeUser)}

              className={`${userIconActionClass} border-[var(--ds-error-border)] text-[var(--ds-error-text)] hover:bg-[var(--ds-error-bg)] disabled:opacity-50`}

              aria-label="Remover perfil selecionado"

              title="Remover perfil"

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

              <li key={group.key} className={adminAccordionItemClass(isOpen)}>

                <button

                  id={triggerId}

                  type="button"

                  aria-expanded={isOpen}

                  aria-controls={panelId}

                  onClick={() => toggleGroup(group.key)}

                  className={adminAccordionTriggerRowClass}

                >

                  <span className={adminAccordionTriggerIconClass(isOpen)}>

                    <HiChevronDown

                      className={`h-5 w-5 transition-transform duration-200 ${

                        isOpen ? "rotate-180" : ""

                      }`}

                      aria-hidden

                    />

                  </span>

                  <span className={adminAccordionTitleClass}>{group.label}</span>

                  <span className={adminAccordionMetaClass}>

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

                  <div className={adminAccordionPanelClass}>

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

        <p className="mt-6 text-sm text-[var(--ds-text-muted)]">

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

        title="Remover perfil?"

        message="Tem certeza que deseja remover este perfil? As permissões associadas serão perdidas."

        confirmLabel="Remover"

        cancelLabel="Cancelar"

        onConfirm={() => {

          if (pendingRemoveId) removeUser(pendingRemoveId);

        }}

        onCancel={() => setPendingRemoveId(null)}

      />



      <ConfirmDialog

        open={blockedRemoveMessage !== null}

        title="Não é possível remover"

        message={blockedRemoveMessage ?? ""}

        confirmLabel="Entendi"

        hideCancel

        onConfirm={() => setBlockedRemoveMessage(null)}

        onCancel={() => setBlockedRemoveMessage(null)}

      />

    </SettingsSection>

  );

}

