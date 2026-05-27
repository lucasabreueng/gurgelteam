"use client";

import Image from "next/image";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { ButtonLink } from "@/components/ui/button";

const slides = [
  { src: "/images/hero-image.jpg", alt: "Kart na pista" },
  { src: "/images/hero-image-2.jpg", alt: "Experiência Gurgel Team" },
];

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative mx-auto mb-5 max-w-[1800px] px-4 sm:px-5"
    >
      <div className="relative overflow-hidden rounded-card bg-secondary">
        <Swiper
          modules={[EffectFade, Pagination, Autoplay]}
          effect="fade"
          loop
          speed={1000}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true, el: ".hero-pagination" }}
          className="hero-swiper"
        >
          {slides.map((s) => (
            <SwiperSlide key={s.src}>
              <div className="relative py-24 md:py-32 lg:py-[120px] xl:py-[165px]">
                {/* Imagem full-bleed + overlay (~55% primary), tema escuro sem overlay (como no CSS original). */}
                <div className="absolute inset-0">
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1800px) 100vw, 1800px"
                  />
                  <div
                    className="absolute inset-0 rounded-card bg-primary/55 dark:hidden"
                    aria-hidden
                  />
                </div>

                <div className="relative z-[2] w-full px-4 md:px-10">
                  <div className="mx-auto max-w-[1130px] text-center">
                    <div className="section-title mb-10 md:mb-10">
                      <h3 className="mb-5 inline-block bg-[url('/images/icon-sparkle-white.svg')] bg-[length:18px_auto] bg-[left_center] bg-no-repeat pl-[26px] text-sm font-medium uppercase tracking-[0.2em] text-white">
                        Kartismo • performance • experiência
                      </h3>
                      <h1 className="m-0 cursor-default text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-[78px]">
                        Viva a experiência do kart profissional com a Gurgel
                        Team
                      </h1>
                      <p className="mx-auto mb-0 mt-5 max-w-[860px] text-base leading-[1.6] text-white md:text-lg">
                        Desde 2017 formando novos pilotos, oferecendo aulas de
                        pilotagem e aluguel de karts profissionais no
                        Kartódromo Ayrton Senna, em Brasília.
                      </p>
                    </div>

                    <div className="hero-btn mt-14 flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
                      <ButtonLink href="/reserva" hideTrailingDecoration>
                        Agendar experiência
                      </ButtonLink>
                      <ButtonLink
                        href="/#sobre"
                        variant="outline"
                        hideTrailingDecoration
                        className="!border-white/20 !bg-transparent !text-white !backdrop-blur-[5px] hover:!text-white"
                      >
                        Conhecer estrutura
                      </ButtonLink>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div
          className="hero-pagination pointer-events-auto absolute bottom-[30px] left-0 right-0 z-[4] flex justify-center"
          aria-hidden
        />
      </div>
    </section>
  );
}
