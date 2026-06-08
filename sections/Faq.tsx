"use client";



import { useState } from "react";

import { SectionHeading } from "@/components/ui/section-heading";

import { Container, WideSection } from "@/components/ui/container";



const faqs = [

  {

    q: "1. Preciso ter experiência prévia para agendar uma aula?",

    a: "Não, exceto categoria 125cc. As aulas são pensadas para todos os níveis, inclusive primeira experiência em kartódromo. A equipe explica equipamentos, regras de segurança e os primeiros passos na pista antes de você sair para o traçado.",

  },

  {

    q: "2. O que está incluso no valor da aula ou do pacote?",

    a: "O pacote contempla o tempo de pista (até 1 hora), o uso do kart da categoria escolhida e o acompanhamento da equipe técnica habilitada, além da orientação sobre traçado e pilotagem. Itens como macacão, luva e sapatilha são inclusos.",

  },

  {

    q: "3. Qual a idade mínima e o que preciso levar no dia?",

    a: "Para a categoria mirim/cadete a idade mínima é de 5 anos e máxima de 11 anos. Para as categorias F400 e 125cc a idade mínima é de 12 anos. Recomendamos calçado fechado, roupa confortável e documento com foto (ou do responsável, no caso de menores). Na dúvida, pergunte no agendamento: nossa equipe orienta tudo antes do dia da atividade.",

  },

  {

    q: "4. Posso remarcar ou cancelar minha reserva?",

    a: "Políticas de cancelamento e remarcação seguem as regras informadas no momento da reserva. Entre em contato com a maior antecedência possível para verificar disponibilidade de novo horário ou condições de estorno.",

  },

];



export function Faq() {

  const [open, setOpen] = useState(0);



  return (

    <WideSection id="faq" className="our-faqs bg-secondary">

      <Container>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">

          <div className="lg:col-span-5">

            <div className="faqs-content">

              <SectionHeading

                kicker="Perguntas frequentes"

                title={

                  <>

                    Respostas para você <span>começar com segurança</span>

                  </>

                }

                description="Tire suas dúvidas sobre aulas, aluguel de kart, categorias e como funciona o dia na pista com a Gurgel Team."

                className="mb-0"

              />

            </div>

          </div>

          <div className="lg:col-span-7">

            <div className="faq-accordion">

              {faqs.map((item, i) => {

                const isOpen = open === i;

                return (

                  <div key={item.q} className="accordion-item">

                    <h2 className="accordion-header">

                      <button

                        type="button"

                        className={`accordion-button${isOpen ? "" : " collapsed"}`}

                        aria-expanded={isOpen}

                        onClick={() => setOpen(isOpen ? -1 : i)}

                      >

                        {item.q}

                      </button>

                    </h2>

                    <div

                      className={`accordion-panel${isOpen ? " is-open" : ""}`}

                      aria-hidden={!isOpen}

                    >

                      <div className="accordion-panel-inner">

                        <div className="accordion-body">

                          <p>{item.a}</p>

                        </div>

                      </div>

                    </div>

                  </div>

                );

              })}

            </div>

          </div>

        </div>

      </Container>

    </WideSection>

  );

}

