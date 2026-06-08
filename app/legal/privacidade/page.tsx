import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicLegalDocumentPage } from "@/components/legal/public-legal-document-page";
import { loadPublishedRegistrationLegalDocuments } from "@/lib/server/auth/registration-legal-documents";
import { Footer } from "@/sections/Footer";
import { Header } from "@/sections/Header";

export const metadata: Metadata = {
  title: "Política de privacidade — Gurgel Team",
  robots: { index: true, follow: true },
};

export const dynamic = "force-dynamic";

export default async function PrivacidadePage() {
  const documents = await loadPublishedRegistrationLegalDocuments();
  const document = documents.find((d) => d.key === "privacy");
  if (!document) notFound();

  return (
    <>
      <Header />
      <main>
        <PublicLegalDocumentPage document={document} />
      </main>
      <Footer />
    </>
  );
}
