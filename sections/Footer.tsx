"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaPhone,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa6";
import { useTheme } from "@/components/theme-provider";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container, WideSection } from "@/components/ui/container";
import {
  WHATSAPP_PHONE_DISPLAY,
  WHATSAPP_PHONE_HREF,
} from "@/lib/landing/constants";

const social = [
  {
    href: "https://www.tiktok.com/@gurgel138",
    label: "TikTok",
    Icon: FaTiktok,
  },
  {
    href: "https://www.facebook.com/GurgelTeam/",
    label: "Facebook",
    Icon: FaFacebookF,
  },
  {
    href: "https://www.instagram.com/gurgelteam/",
    label: "Instagram",
    Icon: FaInstagram,
  },
  {
    href: WHATSAPP_PHONE_HREF,
    label: "WhatsApp",
    Icon: FaWhatsapp,
  },
];

export function Footer() {
  const { resolvedTheme } = useTheme();
  const logoSrc =
    resolvedTheme === "dark" ? "/images/logo-light.svg" : "/images/logo.svg";

  return (
    <footer>
      <WideSection id="contato" className="main-footer bg-secondary">
        <Container>
          <div className="footer-header">
            <SectionHeading
              title={
                <>
                  Viva a pista com quem une{" "}
                  <span>tradição, segurança e performance.</span>
                </>
              }
              className="footer-header-heading mb-0 max-w-[900px]"
            />
            <div className="contact-us-circle shrink-0">
              <Link
                href="/#contato"
                aria-label="Gurgel Team — página de contato"
              >
                <Image
                  src={logoSrc}
                  alt="Gurgel Team"
                  width={160}
                  height={48}
                  className="footer-logo-img h-auto w-full max-w-[160px]"
                />
              </Link>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <div className="about-footer">
              <h3 className="about-footer-heading">Quem Somos</h3>
              <div className="about-footer-content">
                <p>
                  Equipe de kartismo no Kartódromo Ayrton Senna, em Brasília:
                  aulas e aluguel de karts profissionais.
                </p>
              </div>
            </div>

            <div className="footer-links">
              <h3>Contato</h3>
              <div className="footer-contact-list">
                <div className="footer-contact-item footer-contact-item--row">
                  <span className="footer-contact-icon" aria-hidden="true">
                    <FaPhone />
                  </span>
                  <h3 className="footer-contact-value">
                    <a
                      href={WHATSAPP_PHONE_HREF}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Enviar mensagem no WhatsApp para ${WHATSAPP_PHONE_DISPLAY}`}
                    >
                      {WHATSAPP_PHONE_DISPLAY}
                    </a>
                  </h3>
                </div>
                <div className="footer-contact-item footer-contact-item--row">
                  <span className="footer-contact-icon" aria-hidden="true">
                    <FaEnvelope />
                  </span>
                  <h3 className="footer-contact-value footer-contact-value--email">
                    <a href="mailto:contato@gurgelteam.com.br">
                      contato@gurgelteam.com.br
                    </a>
                  </h3>
                </div>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-location-item">
                <h3>Nossa localização</h3>
                <p>
                  <a
                    className="footer-location-link"
                    href="https://www.google.com/maps/search/?api=1&query=Kart%C3%B3dromo%20Ayrton%20Senna%20QE%2023%20%C3%81rea%20Especial%20do%20Cave%20Guar%C3%A1%20Bras%C3%ADlia%20DF"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Kartódromo Ayrton Senna — QE 23, Área Especial do Cave —
                    Guará, Brasília/DF
                  </a>
                </p>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-social-links">
                <h3>Redes Sociais</h3>
                <ul>
                  {social.map(({ href, label, Icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                      >
                        <Icon />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-copyright">
            <div className="footer-copyright-text">
              <p>
                Copyright © {new Date().getFullYear()} Gurgel Team. Todos os
                direitos reservados.
              </p>
            </div>
            <div className="footer-menu">
              <ul>
                <li>
                  <Link href="/legal/privacidade">Política de privacidade</Link>
                </li>
                <li>
                  <Link href="/legal/termos">Termos e condições</Link>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </WideSection>
    </footer>
  );
}
