"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaMoon, FaSun, FaUserGraduate, FaXmark } from "react-icons/fa6";
import { useTheme } from "@/components/theme-provider";
import { ButtonLink } from "@/components/ui/button";

const nav = [
  { href: "/#inicio", label: "Início" },
  { href: "/#sobre", label: "Sobre" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#diferenciais", label: "Diferenciais" },
  { href: "/#planos-kart", label: "Pacotes e preços" },
  { href: "/#depoimentos", label: "Depoimentos" },
  { href: "/#faq", label: "Dúvidas" },
];

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const [barHeight, setBarHeight] = useState(0);

  const logoSrc =
    theme === "dark" ? "/images/logo-light.svg" : "/images/logo.svg";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setBarHeight(el.offsetHeight);
    });
    ro.observe(el);
    setBarHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, [scrolled, open]);

  const linkClass =
    "block rounded-lg px-2.5 py-3 text-base font-medium capitalize text-foreground transition-colors duration-300 hover:text-accent lg:inline-block lg:py-[13px]";

  return (
    <header className="main-header relative z-[100] mx-auto my-5 max-w-[1800px] px-4 sm:px-5">
      {/* Evita salto quando a barra vira fixed (comportamento do site original). */}
      <div
        className="w-full overflow-hidden"
        style={{ height: scrolled ? barHeight : 0 }}
        aria-hidden
      />

      <div
        ref={barRef}
        className={`header-sticky transition-[box-shadow,background-color,border-radius] duration-300 ${
          scrolled
            ? "fixed left-0 right-0 top-0 z-[100] rounded-none border-b border-divider bg-secondary shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:bg-[rgba(10,10,10,0.97)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] dark:backdrop-blur-[10px]"
            : "relative rounded-card bg-secondary"
        }`}
      >
        <nav className="mx-auto flex w-full max-w-[1800px] flex-wrap items-center justify-between gap-y-3 px-6 py-6 md:px-10 md:py-[25px] lg:flex-nowrap">
          <Link href="/#inicio" className="m-0 shrink-0 p-0">
            <Image
              src={logoSrc}
              alt="Gurgel Team"
              width={180}
              height={48}
              className="h-10 w-auto md:h-11"
              priority
            />
          </Link>

          {/* Desktop: links centralizados + ações à direita (layout original). */}
          <div className="hidden min-w-0 flex-1 items-center justify-center px-5 lg:flex">
            <ul className="inline-flex flex-wrap items-center justify-center gap-x-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <button
              type="button"
              className="inline-flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border-2 border-divider bg-background text-lg text-primary transition-colors duration-[250ms] hover:border-accent hover:text-accent dark:text-primary"
              aria-label="Alternar tema claro ou escuro"
              aria-pressed={theme === "dark"}
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <FaSun aria-hidden />
              ) : (
                <FaMoon aria-hidden />
              )}
            </button>
            <Link
              href="/piloto"
              className="inline-flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border-2 border-divider bg-background text-lg text-primary transition-colors duration-[250ms] hover:border-accent hover:text-accent dark:text-primary"
              aria-label="Área do piloto"
            >
              <FaUserGraduate aria-hidden />
            </Link>
            <ButtonLink
              href="/reserva"
              variant="primary"
              hideTrailingDecoration
              className="m-0 capitalize"
            >
              Agendar aula
            </ButtonLink>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-gradient-soft text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">Abrir menu</span>
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-[22px] rounded-sm bg-white" />
              <span className="block h-0.5 w-[22px] rounded-sm bg-white" />
              <span className="block h-0.5 w-[22px] rounded-sm bg-white" />
            </span>
          </button>
        </nav>
      </div>

      {/* Mobile: painel estilo SlickNav (gradiente + texto claro). */}
      {open ? (
        <div
          className="fixed inset-0 z-[200] flex flex-col lg:hidden"
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
        >
          <div className="flex min-h-0 flex-1 flex-col bg-accent-gradient-soft px-6 pb-10 pt-6 text-white">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-lg font-semibold">Menu</span>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 text-white"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
              >
                <FaXmark className="text-xl" />
              </button>
            </div>
            <ul className="flex flex-col">
              {nav.map((item) => (
                <li key={item.href} className="border-b border-white/10">
                  <Link
                    href={item.href}
                    className="block py-4 text-base font-medium capitalize text-white/95 hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-10">
              <button
                type="button"
                className="inline-flex h-[46px] w-[46px] items-center justify-center rounded-full border-2 border-white/25 bg-white/10 text-white"
                onClick={toggleTheme}
                aria-label="Alternar tema"
              >
                {theme === "dark" ? <FaSun /> : <FaMoon />}
              </button>
              <Link
                href="/piloto"
                className="inline-flex h-[46px] w-[46px] items-center justify-center rounded-full border-2 border-white/25 bg-white/10 text-white"
                aria-label="Área do piloto"
                onClick={() => setOpen(false)}
              >
                <FaUserGraduate />
              </Link>
              <ButtonLink
                href="/reserva"
                variant="primary"
                hideTrailingDecoration
                className="flex-1 min-w-[200px] justify-center text-center"
                onClick={() => setOpen(false)}
              >
                Agendar aula
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
