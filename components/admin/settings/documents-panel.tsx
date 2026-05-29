"use client";

import type { DocumentTemplate } from "@/lib/contracts/settings";

import { useState } from "react";

import { DocumentEditDialog } from "./document-edit-dialog";
import { SettingsSection } from "./settings-section";

type Props = {
  documents: DocumentTemplate[];
  onDocumentsChange: (documents: DocumentTemplate[]) => void;
  onDirty: () => void;
};

export function DocumentsPanel({
  documents,
  onDocumentsChange,
  onDirty,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingDoc = documents.find((d) => d.id === editingId) ?? null;

  const touch = () => onDirty();

  const saveDocument = (patch: Partial<DocumentTemplate>) => {
    if (!editingId) return;
    onDocumentsChange(
      documents.map((d) =>
        d.id === editingId
          ? {
              ...d,
              ...patch,
              lastUpdated: new Date().toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
            }
          : d
      )
    );
    setEditingId(null);
    touch();
  };

  return (
    <SettingsSection
      title="Documentos"
      description="Modelos legais e institucionais."
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="flex flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-[#0d1f3c]">{doc.title}</h3>
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                  doc.status === "publicado"
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-amber-50 text-amber-800"
                }`}
              >
                {doc.status}
              </span>
            </div>
            <p className="mt-2 flex-1 text-sm text-neutral-600">
              {doc.description}
            </p>
            <p className="mt-3 text-[11px] text-neutral-500">
              Atualizado · {doc.lastUpdated}
            </p>
            <button
              type="button"
              className="mt-4 rounded-xl border border-[rgba(13,31,60,0.2)] py-2 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c]"
              onClick={() => setEditingId(doc.id)}
            >
              Editar documento
            </button>
          </li>
        ))}
      </ul>

      <DocumentEditDialog
        open={editingId !== null}
        document={editingDoc}
        onConfirm={saveDocument}
        onCancel={() => setEditingId(null)}
      />
    </SettingsSection>
  );
}
