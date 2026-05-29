"use client";

import { useEffect, useState } from "react";

import type { DocumentTemplate } from "@/lib/contracts/settings";

import {
  SettingsField,
  settingsInputClass,
  settingsTextareaClass,
} from "./settings-section";

type Props = {
  open: boolean;
  document: DocumentTemplate | null;
  onConfirm: (patch: Partial<DocumentTemplate>) => void;
  onCancel: () => void;
};

export function DocumentEditDialog({
  open,
  document,
  onConfirm,
  onCancel,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<DocumentTemplate["status"]>("rascunho");

  useEffect(() => {
    if (!open || !document) return;
    setTitle(document.title);
    setDescription(document.description);
    setContent(document.content);
    setStatus(document.status);
  }, [open, document]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open || !document) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[240] flex items-center justify-center bg-black/55 p-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="document-edit-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[rgba(17,17,17,0.1)] bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="document-edit-title"
          className="text-lg font-bold text-[#0d1f3c]"
        >
          Editar documento
        </h2>

        <div className="mt-5 space-y-4">
          <SettingsField label="Título">
            <input
              className={settingsInputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </SettingsField>
          <SettingsField label="Descrição">
            <input
              className={settingsInputClass}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </SettingsField>
          <SettingsField label="Conteúdo">
            <textarea
              className={settingsTextareaClass}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </SettingsField>
          <SettingsField label="Status">
            <div className="flex gap-2">
              {(["publicado", "rascunho"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider ${
                    status === s
                      ? "bg-[#0d1f3c] text-white"
                      : "bg-white ring-1 ring-[rgba(17,17,17,0.1)] text-neutral-600"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </SettingsField>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[rgba(13,31,60,0.2)] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:bg-[#fafbfc]"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!title.trim()}
            onClick={() =>
              onConfirm({
                title: title.trim(),
                description: description.trim(),
                content: content.trim(),
                status,
              })
            }
            className="rounded-xl bg-[#0d1f3c] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
