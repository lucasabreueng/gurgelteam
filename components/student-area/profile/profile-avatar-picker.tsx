"use client";

import Image from "next/image";
import { useRef } from "react";
import { HiCamera } from "react-icons/hi2";

type Props = {
  avatarUrl: string;
  onChange: (url: string) => void;
  size?: number;
  className?: string;
};

export function ProfileAvatarPicker({
  avatarUrl,
  onChange,
  size = 96,
  className = "",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`group relative shrink-0 overflow-hidden rounded-full ring-4 ring-[#f4f6f8] transition hover:ring-accent/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${className}`}
        style={{ width: size, height: size }}
        aria-label="Alterar foto de perfil"
        title="Clique para alterar a foto"
      >
        <Image
          src={avatarUrl}
          alt=""
          fill
          className="object-cover"
          sizes={`${size}px`}
        />
        <span className="absolute inset-0 flex items-center justify-center bg-[#0d1f3c]/0 transition group-hover:bg-[#0d1f3c]/45">
          <HiCamera
            className="h-7 w-7 text-white opacity-0 transition group-hover:opacity-100"
            aria-hidden
          />
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          onChange(URL.createObjectURL(file));
        }}
      />
    </>
  );
}
