"use client";

type Props = {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
};

export function ProfileSectionSaveActions({ dirty, saving, onSave }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      {dirty ? (
        <span className="text-[12px] font-medium text-amber-800">
          Você tem alterações não salvas
        </span>
      ) : null}
      <button
        type="button"
        disabled={saving || !dirty}
        onClick={onSave}
        className="rounded-xl bg-accent px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white shadow-[0_4px_16px_rgba(13,31,60,0.2)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Salvando…" : "Salvar alterações"}
      </button>
    </div>
  );
}
