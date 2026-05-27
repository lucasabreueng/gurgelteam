import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { ClientKartReserva } from "@/components/client-kart-reserva";

export default function ReservaPage() {
  return (
    <>
      <Header />
      <main>
        <ClientKartReserva />
      </main>
      <Footer />
    </>
  );
}
