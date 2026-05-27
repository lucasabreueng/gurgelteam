"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HiMinus, HiPlus, HiArrowPath } from "react-icons/hi2";

type Props = {
  src: string;
  alt?: string;
};

export function OcrImageViewer({ src, alt = "Cronometragem" }: Props) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const clampScale = (s: number) => Math.min(5, Math.max(0.5, s));

  const resetView = useCallback(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setScale((s) => clampScale(s - e.deltaY * 0.002));
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    lastPointer.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-2 overscroll-contain">
      <div className="flex items-center justify-end gap-1.5">
        <button
          type="button"
          onClick={() => setScale((s) => clampScale(s - 0.25))}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
          aria-label="Diminuir zoom"
        >
          <HiMinus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setScale((s) => clampScale(s + 0.25))}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
          aria-label="Aumentar zoom"
        >
          <HiPlus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={resetView}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
          aria-label="Redefinir zoom e posição"
        >
          <HiArrowPath className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={containerRef}
        role="img"
        aria-label={alt}
        className={`relative h-[min(420px,50vh)] w-full max-w-full touch-none overflow-hidden rounded-xl bg-black overscroll-contain ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="pointer-events-none absolute left-1/2 top-1/2 max-h-none max-w-none select-none"
          style={{
            transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(${scale})`,
          }}
        />
      </div>
      <p className="text-center text-[10px] text-neutral-500">
        Arraste para mover · scroll ou botões para zoom
      </p>
    </div>
  );
}
