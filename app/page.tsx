import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Steps } from "@/sections/Steps";
import { Differentials } from "@/sections/Differentials";
import { Services } from "@/sections/Services";
import { Testimonials } from "@/sections/Testimonials";
import { Faq } from "@/sections/Faq";
import { Partners } from "@/sections/Partners";
import { Footer } from "@/sections/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Steps />
        <Differentials />
        <Services />
        <Testimonials />
        <Faq />
        <Partners />
      </main>
      <Footer />
    </>
  );
}
