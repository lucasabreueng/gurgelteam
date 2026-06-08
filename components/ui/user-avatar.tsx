"use client";

import Image from "next/image";
import { HiUser } from "react-icons/hi2";
import { adminAvatarRingClass } from "@/lib/design";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

type Props = {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
  roundedClass?: string;
};

export function UserAvatar({
  src,
  name,
  size = 40,
  className = "",
  roundedClass = "rounded-xl",
}: Props) {
  const trimmed = src?.trim();
  const initials = initialsFromName(name);

  if (trimmed) {
    const useNativeImg =
      trimmed.startsWith("blob:") || trimmed.startsWith("data:");

    return (
      <span
        className={`relative block shrink-0 overflow-hidden shadow-sm ${adminAvatarRingClass} ${roundedClass} ${className}`}
        style={{ width: size, height: size }}
      >
        {useNativeImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={trimmed}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={trimmed}
            alt=""
            fill
            className="object-cover"
            sizes={`${size}px`}
          />
        )}
      </span>
    );
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center bg-accent/10 font-bold text-[var(--ds-text-primary)] shadow-sm ${adminAvatarRingClass} ${roundedClass} ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.32)) }}
      aria-hidden
    >
      {initials || <HiUser className="h-[45%] w-[45%] opacity-60" />}
    </span>
  );
}
