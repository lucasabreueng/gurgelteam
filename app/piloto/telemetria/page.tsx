import type { Metadata } from "next";
import { StudentTelemetryPage } from "@/components/student-area/student-telemetry-page";

export const metadata: Metadata = {
  title: "Telemetria — Área do Piloto | Gurgel Team",
  description:
    "Compare voltas, métricas e traçado da sua última sessão cronometrada na Gurgel Team.",
};

export default function PilotoTelemetriaPage() {
  return <StudentTelemetryPage />;
}
