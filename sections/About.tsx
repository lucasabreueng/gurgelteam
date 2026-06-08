import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/ui/container";

const bullets = [
  "+45 anos de história",
  "Desde 2017 formando pilotos",
  "Acompanhamento individual",
  "Estrutura profissional",
  "Ambiente voltado à evolução",
];

export function About() {
  return (
    <section id="sobre" className="py-14 md:py-24">
      <Container>
        <div className="mb-4 md:mb-8">
          <p className="section-kicker">Sobre a Gurgel Team</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col lg:col-span-4">
            <div className="flex flex-1 flex-col gap-8 rounded-card bg-secondary p-10 md:p-12">
              <h3 className="text-xl font-semibold text-primary">
                Uma história construída na pista
              </h3>
              <div className="flex flex-1 flex-col justify-end">
                <ul className="space-y-3">
                  {bullets.map((t) => (
                    <li
                      key={t}
                      className="relative pl-7 text-base leading-relaxed text-foreground before:absolute before:left-0 before:top-0 before:font-bold before:text-accent before:content-['→']"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:col-span-8">
            <div className="flex flex-1 flex-col">
              <SectionHeading
                title={
                  <>
                    Uma equipe criada para transformar paixão por velocidade em{" "}
                    <span>experiência real de pista.</span>
                  </>
                }
                description="A Gurgel Team nasceu da trajetória de Gurgel, campeão brasiliense de kart em 1979, ano de inauguração do Kartódromo Ayrton Senna. Após retornar ao kartismo em 2017, o box se tornou referência em aulas de pilotagem, aluguel de karts profissionais e introdução de novos pilotos ao automobilismo."
                className="mb-0 max-w-3xl"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
