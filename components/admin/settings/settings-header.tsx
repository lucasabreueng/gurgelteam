"use client";

import { AdminPageHeader } from "../admin-page-header";

type Props = {
  onSave?: () => void;
  onDiscard?: () => void;
  dirty?: boolean;
};

export function SettingsHeader({ onSave, onDiscard, dirty }: Props) {
  return (
    <AdminPageHeader
      title={
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-xl font-bold tracking-tight text-[#0d1f3c] md:text-2xl">
            Configurações
          </h1>
          {dirty ? (
            <span className="text-[12px] font-semibold text-amber-700">
              Alterações não salvas
            </span>
          ) : null}
        </div>
      }
      subtitle="Gerencie preferências, operação, usuários e regras do Gurgel Team."
      actions={
        <>
          <button type="button" onClick={onDiscard} className="btn-outline-md">
            Restaurar
          </button>
          <button type="button" onClick={onSave} className="btn-primary-md">
            Salvar alterações
          </button>
        </>
      }
    />
  );
}
