"use client";

import type { DocumentTemplate } from "@/lib/contracts/settings";

import { useState } from "react";

import {
  documentNeedsPublish,
  documentStatusBadgeClass,
  documentStatusLabel,
  formatDocumentRevision,
  normalizeDocumentTemplate,
} from "@/lib/legal/document-template-utils";

import { DocumentEditDialog } from "./document-edit-dialog";
import { SettingsSection } from "./settings-section";

type Props = {
  documents: DocumentTemplate[];
  onDocumentsChange: (documents: DocumentTemplate[]) => void;
  onDirty: () => void;
  onPublishSave?: (documents: DocumentTemplate[]) => Promise<void>;
};

function formatLastUpdated() {
  return new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function DocumentsPanel({
  documents,
  onDocumentsChange,
  onDirty,
  onPublishSave,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const editingDoc = documents.find((d) => d.id === editingId) ?? null;

  const touch = () => onDirty();

  const updateDocument = (
    id: string,
    patch: Partial<DocumentTemplate>,
  ) => {
    onDocumentsChange(
      documents.map((d) =>
        d.id === id
          ? normalizeDocumentTemplate({
              ...d,
              ...patch,
              lastUpdated: formatLastUpdated(),
            })
          : d,
      ),
    );
    touch();
  };

  const saveDocument = (patch: Partial<DocumentTemplate>) => {
    if (!editingId) return;
    const current = documents.find((d) => d.id === editingId);
    if (!current) return;

    const contentChanged =
      patch.content !== undefined && patch.content.trim() !== current.content.trim();

    updateDocument(editingId, {
      ...patch,
      revision: contentChanged ? current.revision + 1 : current.revision,
      status: contentChanged ? "em_revisao" : current.status,
    });
    setEditingId(null);
  };

  const publishDocument = async (id: string) => {
    const current = documents.find((d) => d.id === id);
    if (!current) return;

    const nextDocuments = documents.map((d) =>
      d.id === id
        ? normalizeDocumentTemplate({
            ...d,
            status: "publicado",
            publishedRevision: current.revision,
            lastUpdated: formatLastUpdated(),
          })
        : d,
    );

    onDocumentsChange(nextDocuments);

    if (onPublishSave) {
      setPublishingId(id);
      try {
        await onPublishSave(nextDocuments);
      } catch (error) {
        console.error("[documents publish]", error);
        onDirty();
      } finally {
        setPublishingId(null);
      }
      return;
    }

    touch();
  };

  return (
    <SettingsSection
      title="Documentos"
      description="Modelos legais e institucionais."
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {documents.map((doc) => {
          const normalized = normalizeDocumentTemplate(doc);
          const canPublish = documentNeedsPublish(normalized);

          return (
            <li
              key={doc.id}
              className="flex flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-[#0d1f3c]">{doc.title}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${documentStatusBadgeClass(normalized)}`}
                    >
                      {documentStatusLabel(normalized)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">{doc.description}</p>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    className="rounded-xl border border-[rgba(13,31,60,0.2)] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:bg-[#fafbfc] sm:min-w-[7.5rem]"
                    onClick={() => setEditingId(doc.id)}
                  >
                    Editar documento
                  </button>
                  <button
                    type="button"
                    disabled={!canPublish || publishingId === doc.id}
                    className="rounded-xl bg-[#0d1f3c] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45 sm:min-w-[7.5rem]"
                    onClick={() => void publishDocument(doc.id)}
                  >
                    {publishingId === doc.id ? "Publicando…" : "Publicar"}
                  </button>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-neutral-500">
                Atualizado · {doc.lastUpdated} ·{" "}
                {formatDocumentRevision(normalized.revision)}
              </p>
            </li>
          );
        })}
      </ul>

      <DocumentEditDialog
        open={editingId !== null}
        document={editingDoc}
        onConfirm={saveDocument}
        onClose={() => setEditingId(null)}
      />
    </SettingsSection>
  );
}
