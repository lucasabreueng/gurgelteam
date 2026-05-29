"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { IconType } from "react-icons/lib";

type Props = {
  navKey: string;
  label: string;
  active: boolean;
  Icon: IconType;
  armed: boolean;
  className: string;
  iconClassName: string;
  onActivate: () => void;
};

/** Item do menu rail compacto: 1º toque = tooltip; 2º toque = navegação. */
export function CollapsedRailNavItem({
  navKey,
  label,
  active,
  Icon,
  armed,
  className,
  iconClassName,
  onActivate,
}: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [tipPos, setTipPos] = useState<{ top: number; left: number } | null>(
    null,
  );

  useLayoutEffect(() => {
    if (!armed) {
      setTipPos(null);
      return;
    }

    const update = () => {
      const el = buttonRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setTipPos({
        top: rect.top + rect.height / 2,
        left: rect.right + 10,
      });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [armed]);

  return (
    <div className="relative flex w-full justify-center" data-collapsed-nav-item>
      {armed && tipPos ? (
        <div
          role="tooltip"
          id={`collapsed-nav-tip-${navKey}`}
          className="pointer-events-none fixed z-[200] -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-[#0d1f3c] px-3 py-2 text-left shadow-[0_8px_24px_rgba(0,0,0,0.28)]"
          style={{ top: tipPos.top, left: tipPos.left }}
        >
          <span className="block text-xs font-semibold text-white">{label}</span>
          <span className="mt-0.5 block text-[10px] font-normal text-white/65">
            Toque novamente para abrir
          </span>
        </div>
      ) : null}
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-describedby={armed ? `collapsed-nav-tip-${navKey}` : undefined}
        aria-current={active ? "page" : undefined}
        className={className}
        onClick={onActivate}
      >
        <Icon className={iconClassName} aria-hidden />
      </button>
    </div>
  );
}
