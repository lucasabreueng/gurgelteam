"use client";

import { useEffect } from "react";
import { HiXMark } from "react-icons/hi2";

import { documentRichTextClassName, isHtmlDocumentContent } from "@/lib/legal/document-content";

type Props = {
  open: boolean;
  title: string;
  content: string;
  lastUpdated?: string;
  revision?: number;
  onClose: () => void;
};

export function LegalDocumentDialog({
  open,
  title,
  content,
  lastUpdated,
  revision,
  onClose,
}: Props) {
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

  if (!open) return null;

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
        aria-labelledby="legal-document-dialog-title"
        className="relative flex max-h-[min(85vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-2xl"
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[rgba(17,17,17,0.08)] px-5 py-4">
          <div>
            <h2
              id="legal-document-dialog-title"
              className="text-lg font-bold text-[#0d1f3c]"
            >
              {title}
            </h2>
            {lastUpdated || revision ? (
              <p className="mt-1 text-[12px] text-neutral-500">
                {lastUpdated ? `Atualizado · ${lastUpdated}` : null}
                {lastUpdated && revision ? " · " : null}
                {revision ? `Revisão ${revision}` : null}
              </p>
            ) : null}
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
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {isHtmlDocumentContent(content) ? (
            <div
              className={documentRichTextClassName}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
              {content}
            </div>
          )}
        </div>
        <footer className="shrink-0 border-t border-[rgba(17,17,17,0.08)] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-[#0d1f3c] px-4 py-3 text-[13px] font-bold uppercase tracking-wider text-white transition hover:brightness-110"
          >
            Fechar
          </button>
        </footer>
      </div>
    </div>
  );
}
