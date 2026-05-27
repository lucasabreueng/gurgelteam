"use client";

import Link from "next/link";
import {
  HiArrowRightOnRectangle,
  HiOutlineUserCircle,
} from "react-icons/hi2";

type Props = {
  profileHref?: string;
  logoutHref?: string;
  onNavigate?: () => void;
};

/** Links de perfil e sair exibidos no drawer mobile da sidebar. */
export function ShellMobileAccountLinks({
  profileHref = "#",
  logoutHref = "/",
  onNavigate,
}: Props) {
  const linkClass =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium text-white transition hover:bg-white/10";

  return (
    <div className="-mx-6 mt-4 border-t border-[rgba(255,255,255,0.12)] px-6 pt-4 lg:hidden">
      <Link
        href={profileHref}
        className={linkClass}
        onClick={() => onNavigate?.()}
      >
        <HiOutlineUserCircle className="h-5 w-5 shrink-0" aria-hidden />
        Meu perfil
      </Link>
      <Link
        href={logoutHref}
        className={`${linkClass} text-red-200 hover:bg-red-500/15 hover:text-white`}
        onClick={() => onNavigate?.()}
      >
        <HiArrowRightOnRectangle className="h-5 w-5 shrink-0" aria-hidden />
        Sair
      </Link>
    </div>
  );
}
