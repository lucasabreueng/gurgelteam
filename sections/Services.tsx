"use client";

import Link from "next/link";
import { useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/ui/container";
import { WideSection } from "@/components/ui/container";
import Image from "next/image";

type TabKey = "cadete" | "f400" | "125cc";

const tabs: { id: TabKey; label: string }[] = [
  { id: "cadete", label: "Mirim e Cadete" },
  { id: "f400", label: "F400" },
  { id: "125cc", label: "125cc" },
];

const guides: Record<TabKey, { title: string; body: string }> = {
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

type Plan = {
  name: string;
  price: string;
  sub?: string;
  desc: string;
  includes: string[];
};

const plans: Record<TabKey, Plan[]> = {
  cadete: [
    {
      name: "Aula avulsa",
      price: "R$ 150,00",
      sub: "/aula",
      desc: "Uma aula prática avulsa no kart da categoria — ideal para experimentar ou complementar seu treino.",
      includes: [
        "1 aula prática",
        "Capacete, macacão, luva e sapatilha",
        "Professor profissional",
      ],
    },
    {
      name: "5 aulas",
      price: "R$ 700,00",
      desc: "Pacote de 5 aulas no kart da categoria — ideal para evolução constante e aprendizado gradual.",
      includes: [
        "5 aulas práticas",
        "Capacete, macacão, luva e sapatilha",
        "Professor profissional",
      ],
    },
    {
      name: "10 aulas",
      price: "R$ 1.350,00",
      desc: "Pacote de 10 aulas no kart da categoria — ideal para alcançar resultados precisos e melhor custo-benefício.",
      includes: [
        "10 aulas práticas",
        "Capacete, macacão, luva e sapatilha",
        "Professor profissional",
      ],
    },
  ],
  f400: [
    {
      name: "Aula avulsa",
      price: "R$ 350,00",
      sub: "/aula",
      desc: "Uma aula prática avulsa no kart da categoria — ideal para experimentar ou complementar seu treino.",
      includes: [
        "1 aula prática",
        "Capacete, macacão, luva e sapatilha",
        "Professor profissional",
      ],
    },
    {
      name: "5 aulas",
      price: "R$ 1.600,00",
      desc: "Pacote de 5 aulas no kart da categoria — ideal para evolução constante e aprendizado gradual.",
      includes: [
        "5 aulas práticas",
        "Capacete, macacão, luva e sapatilha",
        "Professor profissional",
      ],
    },
    {
      name: "10 aulas",
      price: "R$ 3.150,00",
      desc: "Pacote de 10 aulas no kart da categoria — ideal para alcançar resultados precisos e melhor custo-benefício.",
      includes: [
        "10 aulas práticas",
        "Capacete, macacão, luva e sapatilha",
        "Professor profissional",
      ],
    },
  ],
  "125cc": [
    {
      name: "Aula avulsa",
      price: "R$ 600,00",
      sub: "/aula",
      desc: "Uma aula prática avulsa no kart da categoria — ideal para experimentar ou complementar seu treino.",
      includes: [
        "1 aula prática",
        "Capacete, macacão, luva e sapatilha",
        "Professor profissional",
      ],
    },
    {
      name: "5 aulas",
      price: "R$ 2.800,00",
      desc: "Pacote de 5 aulas no kart da categoria — ideal para evolução constante e aprendizado gradual.",
      includes: [
        "5 aulas práticas",
        "Capacete, macacão, luva e sapatilha",
        "Professor profissional",
      ],
    },
    {
      name: "10 aulas",
      price: "R$ 5.400,00",
      desc: "Pacote de 10 aulas no kart da categoria — ideal para alcançar resultados precisos e melhor custo-benefício.",
      includes: [
        "10 aulas práticas",
        "Capacete, macacão, luva e sapatilha",
        "Professor profissional",
      ],
    },
  ],
};

export function Services() {
  const [tab, setTab] = useState<TabKey>("cadete");
  const g = guides[tab];

  return (
    <section id="planos-kart">
      <WideSection className="our-pricing bg-secondary px-4 md:px-8">
        <Container>
          <SectionHeading
            align="center"
            kicker="Planos e preços"
            title={
              <>
                Escolha a <span>categoria</span> e o pacote de aulas ideal para
                você
              </>
            }
            className="mb-16"
          />

          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-full border-2 px-7 py-3 text-base font-semibold transition ${
                  tab === t.id
                    ? "border-accent bg-background text-accent dark:border-accent dark:bg-[#080808]"
                    : "border-divider bg-background text-primary hover:border-accent hover:text-accent dark:bg-[#080808]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mb-12 rounded-2xl bg-background p-7 dark:bg-[#080808]">
            <h4 className="mb-3 text-lg font-bold tracking-tight text-primary dark:text-white">
              {g.title}
            </h4>
            <p className="m-0 text-[15px] leading-relaxed text-foreground">
              {g.body}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans[tab].map((p) => (
              <article
                key={p.name}
                className="relative flex h-full flex-col rounded-card bg-background p-10 dark:bg-[#080808]"
              >
                <div>
                  <span className="mb-8 inline-block rounded-full bg-accent-gradient bg-[length:200%_auto] px-5 py-2.5 text-sm font-medium text-white">
                    {p.name}
                  </span>
                  <h3 className="text-4xl font-bold tracking-tight text-primary dark:text-white">
                    {p.price}
                    {p.sub ? (
                      <sub className="ml-1 text-base font-normal text-foreground">
                        {p.sub}
                      </sub>
                    ) : null}
                  </h3>
                  <p className="mt-8 border-t border-divider pt-8 text-base leading-relaxed text-foreground">
                    {p.desc.split("kart").map((segment, idx, arr) => (
                      <span key={idx}>
                        {segment}
                        {idx < arr.length - 1 ? <strong>kart</strong> : null}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="mt-10 flex-1">
                  <h4 className="mb-5 text-xl font-semibold text-primary dark:text-white">
                    Inclui:
                  </h4>
                  <ul className="space-y-4">
                    {p.includes.map((line) => (
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
                  <Link
                    href="/reserva"
                    className="block w-full rounded-full border border-divider bg-secondary py-[15px] text-center text-base font-semibold capitalize text-primary transition hover:border-transparent hover:bg-accent-gradient hover:bg-[length:200%_auto] hover:text-white dark:border-divider dark:bg-secondary dark:text-primary dark:hover:text-white"
                  >
                    contratar
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <ul className="mt-14 flex flex-col flex-wrap items-center justify-center gap-6 text-center text-base font-semibold text-primary md:flex-row md:gap-10 dark:text-white">
            <li className="flex items-center gap-3">
              <Image
                src="/images/icon-pricing-benefit-1.svg"
                alt=""
                width={22}
                height={22}
              />
              Instrutores habilitados
            </li>
            <li className="flex items-center gap-3">
              <Image
                src="/images/icon-pricing-benefit-2.svg"
                alt=""
                width={22}
                height={22}
              />
              Preços transparentes, sem taxas escondidas
            </li>
            <li className="flex items-center gap-3">
              <Image
                src="/images/icon-pricing-benefit-3.svg"
                alt=""
                width={22}
                height={22}
              />
              Kart da categoria escolhida
            </li>
          </ul>
        </Container>
      </WideSection>
    </section>
  );
}
