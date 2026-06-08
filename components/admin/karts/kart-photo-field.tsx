"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { getDataSourceMode } from "@/lib/data-source/mode";
import { uploadKartPhoto } from "@/lib/karts/upload-kart-photo";
import {
  adminAvatarRingClass,
  adminDrawerOutlineBtnClass,
  adminDrawerDangerBtnClass,
  adminNoteDashedClass,
} from "@/lib/design";
import { SettingsField } from "../settings/settings-section";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

function KartPhotoPreview({ src }: { src: string }) {
  if (!src) {
    return (
      <span className={`flex h-20 w-20 items-center justify-center text-[10px] font-semibold uppercase tracking-wide text-[var(--ds-text-muted)] ${adminNoteDashedClass}`}>
        Sem foto
      </span>
    );
  }

  if (src.startsWith("blob:") || src.startsWith("data:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        className={`h-20 w-20 rounded-xl object-cover shadow-sm ${adminAvatarRingClass}`}
      />
    );
  }

  return (
    <span className={`relative block h-20 w-20 overflow-hidden rounded-xl shadow-sm ${adminAvatarRingClass}`}>
      <Image src={src} alt="" fill className="object-cover" sizes="80px" />
    </span>
  );
}

export function KartPhotoField({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isHttp = getDataSourceMode() === "http";

  const handleFile = async (file: File) => {
    setError(null);
    setLoading(true);
    try {
      if (isHttp) {
        const url = await uploadKartPhoto(file);
        onChange(url);
      } else {
        const preview = URL.createObjectURL(file);
        onChange(preview);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar imagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsField label="Imagem do kart">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[var(--ds-border)] bg-[var(--ds-bg-muted)] p-4">
        <KartPhotoPreview src={value} />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />
        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={loading}
            className={`${adminDrawerOutlineBtnClass} px-4 py-2 disabled:opacity-50`}
            onClick={() => inputRef.current?.click()}
          >
            {loading ? "Carregando…" : value ? "Alterar imagem" : "Enviar imagem"}
          </button>
          {value ? (
            <button
              type="button"
              className={`${adminDrawerDangerBtnClass} px-4 py-2`}
              onClick={() => onChange("")}
            >
              Remover imagem
            </button>
          ) : null}
        </div>
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </SettingsField>
  );
}
