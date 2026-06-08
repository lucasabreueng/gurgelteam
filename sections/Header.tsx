"use client";



import Image from "next/image";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { useEffect, useRef, useState } from "react";

import { FaXmark } from "react-icons/fa6";

import { StudentAreaButton } from "@/components/landing/student-area-button";

import { ThemeToggle } from "@/components/theme-toggle";

import { useTheme } from "@/components/theme-provider";

import { LANDING_NAV, LANDING_SHELL } from "@/lib/landing/constants";



function HeaderNav({

  logoSrc,

  linkClass,

  mobileMenuOpen,

  onOpenMobile,

}: {

  logoSrc: string;

  linkClass: string;

  mobileMenuOpen: boolean;

  onOpenMobile: () => void;

}) {

  return (

    <nav className="flex w-full flex-wrap items-center justify-between gap-y-3 px-6 py-6 md:px-10 md:py-[25px] lg:flex-nowrap">

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



      <div className="hidden min-w-0 flex-1 items-center justify-center px-5 lg:flex">

        <ul className="inline-flex flex-wrap items-center justify-center gap-x-1">

          {LANDING_NAV.map((item) => (

            <li key={item.href}>

              <Link href={item.href} className={linkClass}>

                {item.label}

              </Link>

            </li>

          ))}

        </ul>

      </div>



      <div className="hidden shrink-0 items-center gap-3 lg:flex">

        <ThemeToggle appearance="landing" className="shrink-0" />

        <StudentAreaButton />

      </div>



      <button

        type="button"

        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-white lg:hidden"

        aria-expanded={mobileMenuOpen}

        aria-controls="mobile-nav-drawer"

        onClick={onOpenMobile}

      >

        <span className="sr-only">Abrir menu</span>

        <span className="flex flex-col gap-1.5">

          <span className="block h-0.5 w-[22px] rounded-sm bg-white" />

          <span className="block h-0.5 w-[22px] rounded-sm bg-white" />

          <span className="block h-0.5 w-[22px] rounded-sm bg-white" />

        </span>

      </button>

    </nav>

  );

}



export function Header() {

  const pathname = usePathname();

  const { resolvedTheme } = useTheme();

  const [scrolled, setScrolled] = useState(false);

  const [open, setOpen] = useState(false);

  const barRef = useRef<HTMLDivElement>(null);

  const [barHeight, setBarHeight] = useState(0);



  const logoSrc =

    resolvedTheme === "dark" ? "/images/logo-light.svg" : "/images/logo.svg";



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



  const closeMobileMenu = () => setOpen(false);



  return (

    <header

      className={`main-header relative z-[100] ${LANDING_SHELL} ${

        scrolled ? "" : "mb-5 mt-5"

      }`}

    >

      <div

        className="w-full overflow-hidden"

        style={{ height: scrolled ? barHeight : 0 }}

        aria-hidden

      />



      <div

        ref={barRef}

        className={`header-sticky transition-[box-shadow,background-color,border-radius] duration-300 ${

          scrolled

            ? "header-sticky--scrolled fixed left-0 right-0 top-0 z-[100] rounded-none border-b border-divider bg-secondary/95 shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur-md"

            : "relative rounded-card bg-secondary"

        }`}

      >

        <div className={scrolled ? LANDING_SHELL : undefined}>

          <HeaderNav

            logoSrc={logoSrc}

            linkClass={linkClass}

            mobileMenuOpen={open}

            onOpenMobile={() => setOpen(true)}

          />

        </div>

      </div>



      {open ? (

        <div

          className="fixed inset-0 z-[200] flex flex-col lg:hidden"

          id="mobile-nav-drawer"

          role="dialog"

          aria-modal="true"

          aria-label="Menu principal"

        >

          <div className="flex min-h-0 flex-1 flex-col bg-accent px-6 pb-10 pt-6 text-white">

            <div className="mb-8 flex items-center justify-between">

              <span className="text-lg font-semibold">Menu</span>

              <div className="flex items-center gap-3">

                <ThemeToggle appearance="landing" onDarkSurface />

                <button

                  type="button"

                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 text-white"

                  onClick={closeMobileMenu}

                  aria-label="Fechar menu"

                >

                  <FaXmark className="text-xl" />

                </button>

              </div>

            </div>

            <ul className="flex flex-col">

              {LANDING_NAV.map((item) => (

                <li key={item.href} className="border-b border-white/10">

                  <Link

                    href={item.href}

                    className="block py-4 text-base font-medium capitalize text-white/95 hover:text-white"

                    onClick={closeMobileMenu}

                  >

                    {item.label}

                  </Link>

                </li>

              ))}

            </ul>

            <div className="mt-auto pt-10">

              <StudentAreaButton

                className="w-full justify-center"

                onNavigate={closeMobileMenu}

              />

            </div>

          </div>

        </div>

      ) : null}

    </header>

  );

}

