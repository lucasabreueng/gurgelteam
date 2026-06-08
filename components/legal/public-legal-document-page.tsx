import { Container } from "@/components/ui/container";
import {
  documentRichTextClassName,
  isHtmlDocumentContent,
} from "@/lib/legal/document-content";
import type { RegistrationLegalDocument } from "@/lib/legal/registration-legal";

type Props = {
  document: RegistrationLegalDocument;
};

export function PublicLegalDocumentPage({ document }: Props) {
  return (
    <Container className="py-14 md:py-20">
      <article className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white">
          {document.title}
        </h1>
        {document.lastUpdated ? (
          <p className="mt-2 text-sm text-foreground">
            Atualizado em {document.lastUpdated}
            {document.revision ? ` · Revisão ${document.revision}` : null}
          </p>
        ) : null}
        <div className="mt-8 border-t border-divider pt-8">
          {isHtmlDocumentContent(document.content) ? (
            <div
              className={documentRichTextClassName}
              dangerouslySetInnerHTML={{ __html: document.content }}
            />
          ) : (
            <div className="whitespace-pre-wrap text-base leading-relaxed text-foreground">
              {document.content}
            </div>
          )}
        </div>
      </article>
    </Container>
  );
}
