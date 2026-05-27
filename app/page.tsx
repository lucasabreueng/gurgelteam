import { Header } from "@/sections/Header";
import { ClientHero } from "@/components/client-hero";
import { About } from "@/sections/About";
import { Steps } from "@/sections/Steps";
import { Differentials } from "@/sections/Differentials";
import { Services } from "@/sections/Services";
import { ClientTestimonials } from "@/components/client-testimonials";
import { Faq } from "@/sections/Faq";
import { ClientPartners } from "@/components/client-partners";
import { Footer } from "@/sections/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <ClientHero />
        <About />
        <Steps />
        <Differentials />
        <Services />
        <ClientTestimonials />
        <Faq />
        <ClientPartners />
      </main>
      <Footer />
    </>
  );
}
