import { SchedulePage } from "@/components/admin/schedule-page";

export const metadata = {
  title: "Agenda — Gurgel Team",
  description:
    "Central operacional de aulas, treinos, reservas e disponibilidade do kartódromo.",
};

export default function AdminAgendaPage() {
  return <SchedulePage />;
}
