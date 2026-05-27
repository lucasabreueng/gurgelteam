"use client";

import { useCallback, useRef, useState } from "react";
import { HiCamera, HiCloudArrowUp } from "react-icons/hi2";

type Props = {
  onFile: (file: File) => void;
  loading?: boolean;
};

export function OcrUploadZone({ onFile, loading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      const isImage =
        file.type.startsWith("image/") ||
        /\.(jpe?g|png|webp|gif|bmp)$/i.test(file.name);
      if (!isImage) return;
      onFile(file);
    },
    [onFile],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
        dragOver
          ? "border-accent bg-accent/5"
          : "border-[rgba(13,31,60,0.2)] bg-gradient-to-br from-[#fafbfc] to-white hover:border-accent/40"
      } ${loading ? "pointer-events-none opacity-60" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0d1f3c]/8 text-[#0d1f3c]">
        <HiCloudArrowUp className="h-7 w-7" aria-hidden />
      </span>
      <p className="mt-4 text-sm font-bold text-[#0d1f3c]">
        {loading ? "Lendo cronometragem…" : "Arraste a foto da cronometragem"}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#0d1f3c] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white">
        <HiCamera className="h-4 w-4" />
        Tirar / escolher foto
      </span>
    </div>
  );
}
