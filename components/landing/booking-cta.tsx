"use client";

import { useRouter } from "next/navigation";
import { useState, type MouseEvent, type ReactNode } from "react";
import { fetchAuthenticatedUser } from "@/lib/auth/client-session";
import { resolveBookingPath } from "@/lib/auth/resolve-booking-path";
import { BOOKING_LOGIN_PATH } from "@/lib/landing/booking";

type Variant = "primary" | "outline" | "card" | "inline";

type BookingCtaProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  stopPropagation?: boolean;
  onNavigate?: () => void;
};

const baseBtn =
  "relative inline-flex items-center justify-center rounded-full px-6 py-[15px] text-base font-semibold capitalize transition-all duration-300 disabled:pointer-events-none disabled:opacity-50";

const variantClass: Record<Exclude<Variant, "inline">, string> = {
  primary:
    "bg-accent text-white hover:bg-[var(--color-accent-hover)] z-[1]",
  outline:
    "border border-divider bg-transparent px-6 py-[14px] text-primary backdrop-blur-sm hover:border-accent hover:bg-accent hover:text-white dark:border-dark-divider dark:text-white",
  card: "block w-full rounded-full border border-divider bg-secondary py-[15px] text-center text-base font-semibold text-primary transition hover:border-accent hover:bg-accent hover:text-white",
};

export function BookingCta({
  children,
  variant = "primary",
  className = "",
  stopPropagation = false,
  onNavigate,
}: BookingCtaProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const navigate = async () => {
    if (loading) return;
    setLoading(true);
    onNavigate?.();

    const user = await fetchAuthenticatedUser();
    router.push(user ? resolveBookingPath(user) : BOOKING_LOGIN_PATH);
    setLoading(false);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) e.stopPropagation();
    void navigate();
  };

  if (variant === "inline") {
    return (
      <button
        type="button"
        disabled={loading}
        onClick={() => void navigate()}
        className={`inline font-semibold text-accent underline-offset-4 hover:underline disabled:opacity-60 ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleClick}
      className={`${baseBtn} ${variantClass[variant]} ${className}`}
    >
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
