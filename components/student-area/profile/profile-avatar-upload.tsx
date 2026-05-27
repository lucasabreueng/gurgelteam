"use client";

import Image from "next/image";
import { useRef } from "react";
import { HiCamera } from "react-icons/hi2";

type Props = {
  avatarUrl: string;
  onChange: (url: string) => void;
};

export function ProfileAvatarUpload({ avatarUrl, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-5">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-4 ring-[#f4f6f8]">
        <Image src={avatarUrl} alt="" fill className="object-cover" sizes="80px" />
      </div>
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border border-[rgba(17,17,17,0.1)] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#0d1f3c] shadow-sm transition hover:border-accent/30 hover:bg-[#fafbfc]"
        >
          <HiCamera className="h-4 w-4 text-accent" aria-hidden />
          Alterar foto
        </button>
        <p className="mt-2 text-[12px] text-neutral-500">JPG ou PNG, até 5 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const url = URL.createObjectURL(file);
            onChange(url);
          }}
        />
      </div>
    </div>
  );
}
