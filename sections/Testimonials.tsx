"use client";

import Image from "next/image";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Container } from "@/components/ui/container";

const baseItems = [
  {
    quote:
      "Primeira vez em um kartódromo e me senti super acolhida. Explicaram tudo com calma, desde o capacete até a linha de freada. Saí querendo voltar na semana seguinte.",
    name: "Mariana Souza",
    role: "Piloto iniciante — Brasília (DF)",
  },
  {
    quote:
      "Levei meu filho para a primeira experiência e fiquei impressionado com o cuidado da equipe. Profissionalismo de verdade, sem pressa e com foco em segurança.",
    name: "Ricardo Alves",
    role: "Pai de piloto — Taguatinga (DF)",
  },
  {
    quote:
      "As aulas me ajudaram a ganhar confiança nas curvas e a entender o traçado. Hoje consigo manter ritmo mais constante e já sinto evolução a cada sessão.",
    name: "Fernanda Lima",
    role: "Piloto em evolução — Águas Claras (DF)",
  },
];

/** Cópias extras para o Swiper em loop com `slidesPerView: 2` não ficar sem margem. */
const slideItems = [...baseItems, ...baseItems, ...baseItems];

export function Testimonials() {
  return (
    <section id="depoimentos" className="our-testimonials">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8 xl:gap-12">
          <div className="min-w-0">
            <div className="testimonials-content">
              <div className="section-title">
                <h3>Depoimentos</h3>
                <h2>
                  O que nossos pilotos têm a <span>dizer</span>
                </h2>
                <p>
                  Relatos de quem viveu a experiência na pista com a Gurgel Team
                  — segurança, didática e aquele clima de equipe que marca a
                  primeira volta (e as próximas).
                </p>
              </div>

              <div className="testimonial-slider">
                <Swiper
                  modules={[Autoplay]}
                  className="swiper testimonial-swiper"
                  slidesPerView={1}
                  spaceBetween={30}
                  speed={1000}
                  loop
                  loopAdditionalSlides={2}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  breakpoints={{
                    768: { slidesPerView: 2 },
                    991: { slidesPerView: 2 },
                  }}
                >
                  {slideItems.map((t, i) => (
                    <SwiperSlide key={`${t.name}-${i}`} className="!h-auto">
                      <div className="testimonial-item">
                        <div className="testimonial-quote">
                          <Image
                            src="/images/testimonial-quote.svg"
                            alt=""
                            width={42}
                            height={42}
                          />
                        </div>
                        <div className="testimonial-item-content">
                          <p>{t.quote}</p>
                        </div>
                        <div className="testimonial-author">
                          <div className="author-content">
                            <h3>{t.name}</h3>
                            <p>{t.role}</p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>

          <div className="testimonial-image min-w-0">
            <figure>
              <Image
                src="/images/testimonial-image.jpg"
                alt="Pilotos na pista com a Gurgel Team"
                width={900}
                height={1325}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </figure>
          </div>
        </div>
      </Container>
    </section>
  );
}
