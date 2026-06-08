"use client";

import { useEffect, useState } from "react";
import type { TeamMemberListItem } from "@/lib/contracts/team";
import { useStaffRoleOptions } from "@/lib/query/hooks/use-staff-role-options";
import { resolveMemberPermissionProfileId } from "@/lib/team/staff-roles";
import { isProtectedAdminMember } from "@/lib/team/team-rules";
import { DrawerFooterActions } from "@/components/ui/drawer-footer";
import { adminInputReadonlyClass } from "@/lib/design";
import { SettingsDropdown } from "../settings/settings-dropdown";
import { SettingsField } from "../settings/settings-section";
import { TeamDrawerShell } from "./team-drawer-shell";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  permissionProfileId: string;
};

function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length <= 1) return { firstName: parts[0] ?? "", lastName: "" };
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}

type Props = {
  member: TeamMemberListItem | null;
  mode: "view" | "edit";
  onClose: () => void;
  onSave: (id: string, data: { permissionProfileId: string }) => Promise<void>;
};

export function EditTeamDrawer({ member, mode, onClose, onSave }: Props) {
  const { options: roleOptions } = useStaffRoleOptions();
  const open = Boolean(member);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!member) {
      setForm(null);
      return;
    }
    const { firstName, lastName } = splitName(member.name);
    setForm({
      firstName,
      lastName,
      email: member.email,
      username: member.username,
      permissionProfileId: resolveMemberPermissionProfileId(member),
    });
    setError(null);
  }, [member]);

  const roleDropdownOptions = roleOptions.map((r) => ({
    value: r.value,
    label: r.label,
  }));
  const isAdmin = member ? isProtectedAdminMember(member) : false;
  const isViewMode = mode === "view" || isAdmin;
  const showEditFooter = mode === "edit" && !isAdmin;

  const drawerTitle = isViewMode
    ? isAdmin
      ? "Usuário administrador"
      : "Perfil do usuário"
    : "Editar usuário";

  const handleSubmit = async () => {
    if (!member || !form || isViewMode) return;
    setSaving(true);
    setError(null);
    try {
      await onSave(member.id, {
        permissionProfileId: form.permissionProfileId,
      });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <TeamDrawerShell
      open={open && Boolean(form)}
      onClose={onClose}
      title={drawerTitle}
      titleId="edit-team-title"
      footer={
        showEditFooter ? (
          <DrawerFooterActions columns={2}>
            <button type="button" onClick={onClose} className="btn-outline-md bg-white">
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="btn-primary-md disabled:opacity-50"
            >
              {saving ? "Salvando…" : "Salvar alterações"}
            </button>
          </DrawerFooterActions>
        ) : undefined
      }
    >
      {form ? (
        <div className="space-y-4">
          <SettingsField label="Nome">
            <input
              readOnly
              className={adminInputReadonlyClass}
              value={form.firstName}
            />
          </SettingsField>
          <SettingsField label="Sobrenome">
            <input
              readOnly
              className={adminInputReadonlyClass}
              value={form.lastName}
            />
          </SettingsField>
          <SettingsField label="E-mail">
            <input
              type="email"
              readOnly
              className={adminInputReadonlyClass}
              value={form.email}
            />
          </SettingsField>
          <SettingsField label="Usuário (login)">
            <input
              readOnly
              className={adminInputReadonlyClass}
              value={form.username}
            />
          </SettingsField>
          <SettingsField label="Função">
            <SettingsDropdown
              aria-label="Função"
              value={form.permissionProfileId}
              options={roleDropdownOptions}
              onSelect={(permissionProfileId) =>
                setForm((f) => f && { ...f, permissionProfileId })
              }
              disabled={isViewMode}
            />
          </SettingsField>
          {error ? (
            <p className="text-sm font-semibold text-red-700" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}
    </TeamDrawerShell>
  );
}
