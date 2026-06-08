"use client";

import { useEffect, useState } from "react";
import { DrawerFooterActions } from "@/components/ui/drawer-footer";
import { adminInputClass, adminInputReadonlyClass } from "@/lib/design";
import { useSuggestedUsername } from "@/lib/hooks/use-suggested-username";
import { useStaffRoleOptions } from "@/lib/query/hooks/use-staff-role-options";
import { ROLE_TO_PERMISSION_PROFILE } from "@/lib/settings/permission-profile-ids";
import { SettingsDropdown } from "../settings/settings-dropdown";
import { SettingsCheckbox } from "../settings/settings-checkbox";
import { SettingsField } from "../settings/settings-section";
import { TeamDrawerShell } from "./team-drawer-shell";

export type NewTeamFormData = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  permissionProfileId: string;
  active: boolean;
};

const EMPTY: NewTeamFormData = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  permissionProfileId: ROLE_TO_PERMISSION_PROFILE.recepcao,
  active: true,
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: (data: NewTeamFormData) => Promise<void>;
};

export function NewTeamDrawer({ open, onClose, onSuccess }: Props) {
  const { options: profileOptions, defaultPermissionProfileId } =
    useStaffRoleOptions();
  const [form, setForm] = useState<NewTeamFormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const namesComplete =
    form.firstName.trim().length > 0 && form.lastName.trim().length > 0;

  const { username: suggestedUsername, loading: usernameLoading } =
    useSuggestedUsername(
      form.firstName,
      form.lastName,
      open && namesComplete,
    );

  useEffect(() => {
    if (!open) return;
    setForm({ ...EMPTY, permissionProfileId: defaultPermissionProfileId });
    setError(null);
  }, [open, defaultPermissionProfileId]);

  const profileDropdownOptions = profileOptions.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  const handleSubmit = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("Informe nome e sobrenome.");
      return;
    }
    if (!form.email.trim()) {
      setError("Informe o e-mail.");
      return;
    }
    if (!suggestedUsername || usernameLoading) {
      setError("Aguarde a verificação do usuário de login.");
      return;
    }
    if (!form.permissionProfileId) {
      setError("Selecione uma função.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSuccess({
        ...form,
        email: form.email.trim().toLowerCase(),
        username: suggestedUsername,
      });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível criar o usuário.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <TeamDrawerShell
      open={open}
      onClose={onClose}
      title="Novo usuário"
      titleId="new-team-title"
      footer={
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
            {saving ? "Salvando…" : "Criar usuário"}
          </button>
        </DrawerFooterActions>
      }
    >
      <div className="space-y-4">
        <SettingsField label="Nome">
          <input
            className={adminInputClass}
            value={form.firstName}
            onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
          />
        </SettingsField>
        <SettingsField label="Sobrenome">
          <input
            className={adminInputClass}
            value={form.lastName}
            onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
          />
        </SettingsField>
        <SettingsField label="Usuário (login)">
          <input
            type="text"
            readOnly
            value={suggestedUsername}
            placeholder={
              namesComplete
                ? usernameLoading
                  ? "Verificando…"
                  : "nome.sobrenome"
                : "Preencha nome e sobrenome"
            }
            className={adminInputReadonlyClass}
          />
        </SettingsField>
        <SettingsField label="E-mail">
          <input
            type="email"
            className={adminInputClass}
            value={form.email}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                email: e.target.value.replace(/\s/g, "").toLowerCase(),
              }))
            }
          />
        </SettingsField>
        <SettingsField label="Função">
          <SettingsDropdown
            aria-label="Função"
            value={form.permissionProfileId}
            options={profileDropdownOptions}
            onSelect={(permissionProfileId) =>
              setForm((f) => ({ ...f, permissionProfileId }))
            }
          />
        </SettingsField>
        <div className="flex items-center gap-3">
          <SettingsCheckbox
            checked={form.active}
            onChange={(active) => setForm((f) => ({ ...f, active }))}
            aria-label="Usuário ativo"
          />
          <span className="text-sm font-medium text-[#0d1f3c]">Usuário ativo</span>
        </div>
        {error ? (
          <p className="text-sm font-semibold text-red-700" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </TeamDrawerShell>
  );
}
