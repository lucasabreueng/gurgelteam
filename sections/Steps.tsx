import { BookingCta } from "@/components/landing/booking-cta";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container, WideSection } from "@/components/ui/container";
import Image from "next/image";

const steps = [
  {
    icon: "/images/icon-work-step-1.svg",
    title: "Agendamento",
    body: "Escolha sua experiência, selecione o melhor horário e agende sua aula ou sessão de kart.",
    step: "ETAPA 01",
  },
  {
    icon: "/images/icon-work-step-2.svg",
    title: "Preparação",
    body: "Receba orientações da equipe, equipamentos de segurança e introdução aos fundamentos da pilotagem.",
    step: "ETAPA 02",
  },
  {
    icon: "/images/icon-work-step-3.svg",
    title: "Experiência em pista",
    body: "Entre na pista com acompanhamento profissional e viva a experiência real do kartismo.",
    step: "ETAPA 03",
  },
  {
    icon: "/images/icon-work-step-4.svg",
    title: "Evolução",
    body: "Acompanhe sua evolução, desenvolva sua pilotagem e continue a evoluir com novas aulas e experiências.",
    step: "ETAPA 04",
  },
];

export function Steps() {
  return (
    <section id="como-funciona">
      <WideSection className="how-it-work bg-secondary">
        <Container>
          <SectionHeading
            align="center"
            kicker="Como funciona"
            title={
              <>
                Começar no kartismo nunca foi <span>tão simples</span>
              </>
            }
            description="A Gurgel Team acompanha você desde o agendamento até sua evolução nas pistas."
            className="mb-20"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.step} className="work-step-item box-bg-shape">
                <div className="icon-box">
                  <Image src={s.icon} alt="" width={30} height={30} />
                </div>
                <div className="work-step-content">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
                <div className="work-step-no">
                  <h3>{s.step}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center text-lg text-primary dark:text-white">
            Pronto para viver sua primeira experiência no kart?{" "}
            <BookingCta variant="inline">Agendar experiência</BookingCta>
          </div>
        </Container>
      </WideSection>
    </section>
  );
}
