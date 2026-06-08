import type { Metadata } from "next";
import { PilotBookingPage } from "@/components/student-area/booking/pilot-booking-page";

export const metadata: Metadata = {
  title: "Reservar horário — Área do Piloto | Gurgel Team",
  description:
    "Consulte a agenda do kartódromo e escolha data e horário para sua próxima aula.",
};

export default function PilotoReservarPage() {
  return <PilotBookingPage />;
}
