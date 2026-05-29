"use client";

import Image from "next/image";
import Link from "next/link";
import { HiOutlineUserCircle } from "react-icons/hi2";

type Props = {
  profileHref: string;
  avatarSrc?: string;
  collapsed?: boolean;
  onNavigate?: () => void;
};

/** Perfil no rodapé da sidebar — tablet telemetria (substitui o header). */
export function ShellSidebarTabletProfile({
  profileHref,
  avatarSrc,
  collapsed = false,
  onNavigate,
}: Props) {
  return (
    <div
      className={`mt-auto shrink-0 border-t border-[rgba(255,255,255,0.12)] pt-2 ${
        collapsed ? "-mx-2 px-2" : "-mx-6 px-6"
      }`}
    >
      <Link
        href={profileHref}
        className={`flex w-full items-center rounded-xl text-white transition hover:bg-white/10 ${
          collapsed ? "justify-center p-2.5" : "gap-3 py-2.5"
        }`}
        aria-label="Meu perfil"
        title="Meu perfil"
        onClick={() => onNavigate?.()}
      >
        {avatarSrc ? (
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-white/25">
            <Image
              src={avatarSrc}
              alt=""
              fill
              className="object-cover"
              sizes="36px"
            />
          </span>
        ) : (
          <HiOutlineUserCircle
            className={`shrink-0 text-white ${collapsed ? "h-7 w-7" : "h-6 w-6"}`}
            aria-hidden
          />
        )}
        {!collapsed ? (
          <span className="text-[14px] font-medium">Meu perfil</span>
        ) : null}
      </Link>
    </div>
  );
}
