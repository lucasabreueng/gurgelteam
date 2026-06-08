"use client";

import { useRef, useState } from "react";
import { HiCamera } from "react-icons/hi2";

import { getDataSourceMode } from "@/lib/data-source/mode";
import { uploadPilotAvatar } from "@/lib/student/upload-pilot-avatar";
import { UserAvatar } from "@/components/ui/user-avatar";

type Props = {
  avatarUrl: string;
  name: string;
  onChange: (url: string) => void;
  clientId?: string;
  /** Mantém a foto apenas local (cadastro antes de criar o piloto). */
  localOnly?: boolean;
  size?: number;
  className?: string;
};

export function ProfileAvatarPicker({
  avatarUrl,
  name,
  onChange,
  clientId,
  localOnly = false,
  size = 96,
  className = "",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isHttp = getDataSourceMode() === "http";

  const handleFile = async (file: File) => {
    setError(null);
    setLoading(true);
    try {
      if (localOnly) {
        const dataUrl = await readFileAsDataUrl(file);
        onChange(dataUrl);
        return;
      }
      if (isHttp) {
        const url = await uploadPilotAvatar(file, clientId);
        onChange(url);
      } else {
        onChange(URL.createObjectURL(file));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar imagem.");
    } finally {
      setLoading(false);
    }
  };

  function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") resolve(reader.result);
        else reject(new Error("Falha ao ler a imagem."));
      };
      reader.onerror = () => reject(new Error("Falha ao ler a imagem."));
      reader.readAsDataURL(file);
    });
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="group relative shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-60"
        style={{ width: size, height: size }}
        aria-label="Alterar foto de perfil"
        title="Clique para alterar a foto"
      >
        <UserAvatar
          src={avatarUrl}
          name={name}
          size={size}
          roundedClass="rounded-full"
          className="ring-4 ring-[#f4f6f8]"
        />
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-[#0d1f3c]/0 transition group-hover:bg-[#0d1f3c]/45">
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
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
      {loading ? (
        <p className="mt-2 text-center text-xs font-medium text-neutral-500">
          Enviando foto…
        </p>
      ) : null}
      {error ? (
        <p className="mt-2 text-center text-xs font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
