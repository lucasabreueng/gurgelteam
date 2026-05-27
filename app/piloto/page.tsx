import type { Metadata } from "next";
import { Suspense } from "react";
import { StudentDashboardPage } from "@/components/student-area/student-dashboard-page";

export const metadata: Metadata = {
  title: "Área do Piloto — Gurgel Team",
  description:
    "Painel do piloto: evolução, agenda, telemetria, feedbacks e materiais da Gurgel Team.",
};

export default function PilotoPage() {
  return (
    <Suspense fallback={null}>
      <StudentDashboardPage />
    </Suspense>
  );
}
