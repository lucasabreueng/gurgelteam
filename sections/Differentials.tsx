import Image from "next/image";

import { BookingCta } from "@/components/landing/booking-cta";

import { SectionHeading } from "@/components/ui/section-heading";

import { Container } from "@/components/ui/container";



const items = [

  {

    icon: "/images/icon-diferencial-kart.svg",

    title: "Acesso facilitado",

    text: "Você não precisa ter kart próprio para viver uma experiência real de pista.",

    points: ["Aluguel de karts profissionais", "Estrutura pronta para pilotar"],

  },

  {

    icon: "/images/icon-diferencial-aulas.svg",

    title: "Aulas para iniciantes",

    text: "Aprenda os fundamentos da pilotagem com orientação simples, segura e prática.",

    points: ["Primeiros passos no kartismo", "Acompanhamento da equipe"],

  },

  {

    icon: "/images/icon-diferencial-evolucao.svg",

    title: "Evolução na pista",

    text: "Cada experiência ajuda o piloto a ganhar confiança, constância e controle.",

    points: [

      "Feedback de pilotagem com telemetria",

      "Desenvolvimento progressivo",

    ],

  },

  {

    icon: "/images/icon-diferencial-equipe.svg",

    title: "Ambiente de equipe",

    text: "Um box criado para aproximar novas pessoas do kartismo com acolhimento.",

    points: [

      "Vivência no Kartódromo Ayrton Senna",

      "Tradição conhecida desde 1979",

    ],

  },

];



export function Differentials() {

  return (

    <section id="diferenciais" className="our-features">

      <Container>

        <div className="mb-16 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

          <div className="max-w-3xl">

            <SectionHeading

              kicker="Nossos diferenciais"

              title={

                <>

                  Uma experiência de kart pensada para quem quer{" "}

                  <span>começar e evoluir</span>

                </>

              }

              className="mb-0"

            />

          </div>

          <div className="shrink-0">

            <BookingCta variant="primary">Agendar agora</BookingCta>

          </div>

        </div>



        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {items.map((f) => (

            <div key={f.title} className="feature-item box-bg-shape">

              <div className="icon-box">

                <Image

                  src={f.icon}

                  alt=""

                  width={40}

                  height={40}

                  className="landing-navy-icon"

                />

              </div>

              <div className="features-item-content">

                <h3>{f.title}</h3>

                <p>{f.text}</p>

                <ul>

                  {f.points.map((p) => (

                    <li key={p}>{p}</li>

                  ))}

                </ul>

              </div>

            </div>

          ))}

        </div>

      </Container>

    </section>

  );

}

