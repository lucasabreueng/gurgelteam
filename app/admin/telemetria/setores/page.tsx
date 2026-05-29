import type { Metadata } from "next";
import { StudentTelemetrySectorsPage } from "@/components/student-area/student-telemetry-sectors-page";

export const metadata: Metadata = {
  title: "Setores — Telemetria | Gurgel Team",
  description: "Tempos por setor da sessão cronometrada na Gurgel Team.",
};

export default function AdminTelemetriaSetoresPage() {
  return <StudentTelemetrySectorsPage />;
}
