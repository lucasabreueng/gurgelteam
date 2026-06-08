import type { DocumentTemplate } from "@/lib/contracts/settings";

export type DocumentTemplateStatus = DocumentTemplate["status"];

export function normalizeDocumentTemplate(
  doc: DocumentTemplate,
): DocumentTemplate {
  const revision = typeof doc.revision === "number" && doc.revision > 0 ? doc.revision : 1;
  let status = doc.status;
  if (status === "rascunho") {
    status = "em_revisao";
  }
  const publishedRevision =
    typeof doc.publishedRevision === "number" && doc.publishedRevision >= 0
      ? doc.publishedRevision
      : status === "publicado"
        ? revision
        : 0;

  return {
    ...doc,
    revision,
    publishedRevision,
    status,
  };
}

export function documentNeedsPublish(doc: DocumentTemplate): boolean {
  const normalized = normalizeDocumentTemplate(doc);
  return (
    normalized.status !== "publicado" ||
    normalized.revision !== normalized.publishedRevision
  );
}

export function documentStatusLabel(doc: DocumentTemplate): string {
  const normalized = normalizeDocumentTemplate(doc);
  if (
    normalized.status === "publicado" &&
    normalized.revision === normalized.publishedRevision
  ) {
    return "Publicado";
  }
  return "Em revisão";
}

export function documentStatusBadgeClass(doc: DocumentTemplate): string {
  const normalized = normalizeDocumentTemplate(doc);
  if (
    normalized.status === "publicado" &&
    normalized.revision === normalized.publishedRevision
  ) {
    return "bg-emerald-50 text-emerald-800";
  }
  return "bg-amber-50 text-amber-800";
}

export function formatDocumentRevision(revision: number): string {
  return `Revisão ${revision}`;
}
