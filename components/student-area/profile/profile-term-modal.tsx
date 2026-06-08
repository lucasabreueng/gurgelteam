"use client";

import { AppModal } from "@/components/ui/app-modal";
import {
  documentRichTextClassName,
  isHtmlDocumentContent,
} from "@/lib/legal/document-content";

type Props = {
  open: boolean;
  title: string;
  body: string;
  onClose: () => void;
};

export function ProfileTermModal({ open, title, body, onClose }: Props) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="lg"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-accent py-3 text-[12px] font-bold uppercase tracking-wider text-white transition hover:brightness-110"
        >
          Fechar
        </button>
      }
    >
      {isHtmlDocumentContent(body) ? (
        <div
          className={documentRichTextClassName}
          dangerouslySetInnerHTML={{ __html: body }}
        />
      ) : (
        <p className="whitespace-pre-line text-[14px] leading-relaxed text-neutral-700">
          {body}
        </p>
      )}
    </AppModal>
  );
}
