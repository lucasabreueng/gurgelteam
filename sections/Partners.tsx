"use client";

import Image from "next/image";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Container } from "@/components/ui/container";

const baseLogos = [
  { src: "/images/orbit.png", alt: "Orbit" },
  { src: "/images/dinastia.png", alt: "Dinastia" },
  { src: "/images/hase.png", alt: "Hase" },
];

/** Várias cópias para o loop do Swiper cumprir `slidesPerView` + `slidesPerGroup` e não desativar o loop. */
const logos = Array.from({ length: 8 }, () => baseLogos).flat();

export function Partners() {
  const handleSwiper = (swiper: SwiperType) => {
    queueMicrotask(() => {
      swiper.autoplay?.stop();
      swiper.autoplay?.start();
    });
  };

  return (
    <section id="parceiros" className="company-partners">
      <Container>
        <div className="company-slider-box">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={2}
            slidesPerGroup={1}
            spaceBetween={30}
            loop
            loopAdditionalSlides={8}
            speed={2000}
            watchSlidesProgress
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            onSwiper={handleSwiper}
            breakpoints={{
              768: { slidesPerView: 4, spaceBetween: 30 },
              991: { slidesPerView: 6, spaceBetween: 30 },
            }}
            className="partners-swiper swiper"
          >
            {logos.map((l, i) => (
              <SwiperSlide key={`${l.src}-${i}`} className="!h-auto">
                <div className="company-supports-logo flex items-center justify-center py-4">
                  <Image
                    src={l.src}
                    alt={l.alt}
                    width={180}
                    height={48}
                    className="h-10 w-auto max-w-full object-contain opacity-80 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>
    </section>
  );
}
