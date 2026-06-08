"use client";

import { useEffect, useState } from "react";
import { HiXMark } from "react-icons/hi2";

import type { DocumentTemplate } from "@/lib/contracts/settings";
import {
  documentContentIsEmpty,
  plainContentToEditorHtml,
  sanitizeDocumentHtml,
} from "@/lib/legal/document-content";
import { adminLabelClass } from "@/lib/design/classes";

import { RichTextEditor } from "./rich-text-editor";

type Props = {
  open: boolean;
  document: DocumentTemplate | null;
  onConfirm: (patch: Partial<DocumentTemplate>) => void;
  onClose: () => void;
};

export function DocumentEditDialog({
  open,
  document: doc,
  onConfirm,
  onClose,
}: Props) {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!open || !doc) return;
    setContent(plainContentToEditorHtml(doc.content));
  }, [open, doc]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !doc) return null;

  const isEmpty = documentContentIsEmpty(content);

  return (
    <div className="fixed inset-0 z-[240] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        aria-label="Fechar"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="document-edit-title"
        className="relative flex max-h-[min(90vh,820px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-2xl"
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[rgba(17,17,17,0.08)] px-5 py-4">
          <div>
            <h2
              id="document-edit-title"
              className="text-lg font-bold text-[#0d1f3c]"
            >
              Editar documento
            </h2>
            <p className="mt-1 text-sm font-semibold text-[#0d1f3c]">
              {doc.title}
            </p>
            <p className="mt-0.5 text-sm text-neutral-600">{doc.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-500 hover:bg-neutral-100"
            aria-label="Fechar"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-5 py-4">
          <label className={adminLabelClass}>Conteúdo</label>
          <RichTextEditor
            fillHeight
            value={content}
            onChange={setContent}
            minHeight={240}
          />
        </div>

        <footer className="shrink-0 border-t border-[rgba(17,17,17,0.08)] px-5 py-4">
          <button
            type="button"
            disabled={isEmpty}
            onClick={() =>
              onConfirm({
                content: sanitizeDocumentHtml(content),
              })
            }
            className="w-full rounded-xl bg-[#0d1f3c] px-4 py-3 text-[13px] font-bold uppercase tracking-wider text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Salvar
          </button>
        </footer>
      </div>
    </div>
  );
}
