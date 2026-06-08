import { redirect } from "next/navigation";
import { BOOKING_LOGIN_PATH } from "@/lib/landing/booking";

/** Rota legada — redireciona visitantes para login antes do agendamento. */
export default function ReservaRedirectPage() {
  redirect(BOOKING_LOGIN_PATH);
}
