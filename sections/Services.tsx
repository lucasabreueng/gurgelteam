"use client";



import { useState } from "react";

import { FaCircleCheck } from "react-icons/fa6";

import Image from "next/image";

import { BookingCta } from "@/components/landing/booking-cta";

import { SectionHeading } from "@/components/ui/section-heading";

import { Container, WideSection } from "@/components/ui/container";



type CategoryKey = "cadete" | "f400" | "125cc";



const LESSON_DESC = (

  <>

    Uma aula prática avulsa no <strong>kart</strong> da categoria — ideal para

    experimentar ou complementar seu treino.

  </>

);



const LESSON_INCLUDES = [

  "1 aula prática",

  "Capacete, macacão, luva e sapatilha",

  "Professor profissional",

] as const;



const categories: {

  id: CategoryKey;

  label: string;

  price: string;

  sub: string;

}[] = [

  { id: "cadete", label: "Mirim e Cadete", price: "R$ 150,00", sub: "/aula" },

  { id: "f400", label: "F400", price: "R$ 350,00", sub: "/aula" },

  { id: "125cc", label: "125cc", price: "R$ 600,00", sub: "/aula" },

];



const guides: Record<CategoryKey, { title: string; body: string }> = {

  cadete: {

    title: "Mirim e Cadete",

    body: "Categoria de iniciação no kart voltada para crianças (até 11 anos), com motores menos potentes e foco no aprendizado de pilotagem, traçado, segurança e desenvolvimento técnico gradual dentro do kartismo.",

  },

  f400: {

    title: "F400",

    body: "Categoria de kart profissional com motores na faixa de 18 hp, focada em corridas acessíveis e disputas equilibradas. Indicada para pilotos iniciantes acima de 11 anos, amadores e treinos de pilotagem competitiva.",

  },

  "125cc": {

    title: "125cc",

    body: "Categoria de kart com motorização na faixa de 125 cm³, com dinâmica própria. Indicado para evolução técnica e competição. Necessita de experiência prévia em kart de categoria inferior.",

  },

};



export function Services() {

  const [selected, setSelected] = useState<CategoryKey>("cadete");

  const g = guides[selected];



  return (

    <section id="planos-kart">

      <WideSection className="our-pricing bg-secondary px-4 md:px-8">

        <Container>

          <SectionHeading

            align="center"

            kicker="Preços"

            title={

              <>

                Conheça os <span>valores</span> das aulas por categoria

              </>

            }

            className="mb-16"

          />



          <div className="mb-12 rounded-2xl bg-background p-7">

            <h4 className="mb-3 text-lg font-bold tracking-tight text-primary dark:text-white">

              {g.title}

            </h4>

            <p className="m-0 text-[15px] leading-relaxed text-foreground">

              {g.body}

            </p>

          </div>



          <div className="grid gap-6 md:grid-cols-3">

            {categories.map((c) => {

              const isSelected = selected === c.id;

              return (

                <article

                  key={c.id}

                  role="button"

                  tabIndex={0}

                  aria-pressed={isSelected}

                  onClick={() => setSelected(c.id)}

                  onKeyDown={(e) => {

                    if (e.key === "Enter" || e.key === " ") {

                      e.preventDefault();

                      setSelected(c.id);

                    }

                  }}

                  className={`relative flex h-full cursor-pointer flex-col rounded-card bg-background p-10 outline-none transition-shadow duration-300 ${

                    isSelected

                      ? "ring-2 ring-accent ring-offset-2 ring-offset-secondary"

                      : "hover:ring-2 hover:ring-accent/40 hover:ring-offset-2 hover:ring-offset-secondary"

                  }`}

                >

                  <div>

                    <span className="mb-8 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white">

                      {c.label}

                    </span>

                    <h3 className="text-4xl font-bold tracking-tight text-primary dark:text-white">

                      {c.price}

                      <sub className="ml-1 text-base font-normal text-foreground">

                        {c.sub}

                      </sub>

                    </h3>

                    <p className="mt-8 border-t border-divider pt-8 text-base leading-relaxed text-foreground">

                      {LESSON_DESC}

                    </p>

                  </div>

                  <div className="mt-10 flex-1">

                    <h4 className="mb-5 text-xl font-semibold text-primary dark:text-white">

                      Inclui:

                    </h4>

                    <ul className="space-y-4">

                      {LESSON_INCLUDES.map((line) => (

                        <li

                          key={line}

                          className="flex gap-3 text-base leading-relaxed text-foreground"

                        >

                          <FaCircleCheck

                            className="mt-0.5 shrink-0 text-lg text-accent"

                            aria-hidden

                          />

                          {line}

                        </li>

                      ))}

                    </ul>

                  </div>

                  <div className="mt-10">

                    <BookingCta variant="card" stopPropagation>

                      Agendar agora!

                    </BookingCta>

                  </div>

                </article>

              );

            })}

          </div>



          <ul className="mt-14 flex flex-col flex-wrap items-center justify-center gap-6 text-center text-base font-semibold text-primary md:flex-row md:gap-10 dark:text-white">

            <li className="flex items-center gap-3">

              <Image

                src="/images/icon-pricing-benefit-1.svg"

                alt=""

                width={22}

                height={22}

                className="landing-navy-icon"

              />

              Equipe técnica habilitada

            </li>

            <li className="flex items-center gap-3">

              <Image

                src="/images/icon-pricing-benefit-2.svg"

                alt=""

                width={22}

                height={22}

                className="landing-navy-icon"

              />

              Preços transparentes, sem taxas escondidas

            </li>

            <li className="flex items-center gap-3">

              <Image

                src="/images/icon-pricing-benefit-3.svg"

                alt=""

                width={22}

                height={22}

                className="landing-navy-icon"

              />

              Kart da categoria escolhida

            </li>

          </ul>

        </Container>

      </WideSection>

    </section>

  );

}

