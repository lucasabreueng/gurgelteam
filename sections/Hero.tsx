"use client";



import Image from "next/image";

import { Autoplay, EffectFade } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import "swiper/css/effect-fade";

import { BookingCta } from "@/components/landing/booking-cta";

import { ButtonLink } from "@/components/ui/button";

import { SectionHeading } from "@/components/ui/section-heading";

import { LANDING_SHELL } from "@/lib/landing/constants";



const slides = [

  { src: "/images/hero-image.jpg", alt: "Kart na pista" },

  { src: "/images/hero-image-2.jpg", alt: "Experiência Gurgel Team" },

];



export function Hero() {

  return (

    <section id="inicio" className={`hero relative mb-5 ${LANDING_SHELL}`}>

      <div className="relative overflow-hidden rounded-card bg-secondary">

        <Swiper

          modules={[EffectFade, Autoplay]}

          effect="fade"

          loop

          speed={1000}

          autoplay={{ delay: 4000, disableOnInteraction: false }}

          className="hero-swiper"

        >

          {slides.map((s) => (

            <SwiperSlide key={s.src}>

              <div className="relative py-24 md:py-32 lg:py-[120px] xl:py-[165px]">

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

                    className="hero-image-overlay absolute inset-0 rounded-card"

                    aria-hidden

                  />

                </div>



                <div className="relative z-[2] w-full px-4 md:px-10">

                  <div className="mx-auto max-w-[1130px] text-center">

                    <SectionHeading

                      tone="on-dark"

                      align="center"

                      headingLevel="h1"

                      kicker="Kartismo • performance • experiência"

                      title="Viva a experiência do kart profissional com a Gurgel Team"

                      description="Desde 2017 formando novos pilotos, oferecendo aulas de pilotagem e aluguel de karts profissionais no Kartódromo Ayrton Senna, em Brasília."

                      className="hero-heading mb-10 md:mb-10"

                    />



                    <div className="hero-btn mt-14 flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">

                      <BookingCta variant="primary">
                        Agendar experiência
                      </BookingCta>

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

      </div>

    </section>

  );

}

