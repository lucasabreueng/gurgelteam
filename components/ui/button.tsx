import Link from "next/link";
import { type ReactNode } from "react";

type Variant = "primary" | "outline";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /** Esconde o círculo/seta à direita (ex.: botão na barra do header). */
  hideTrailingDecoration?: boolean;
  onClick?: () => void;
};

const base =
  "relative inline-flex items-center justify-center rounded-full px-6 py-[15px] text-base font-semibold capitalize transition-all duration-300 z-[1]";

const variants: Record<Variant, string> = {
  primary:
    "bg-[length:200%_auto] bg-accent-gradient text-white hover:bg-right",
  outline:
    "border border-divider bg-transparent px-6 py-[14px] text-primary backdrop-blur-sm hover:text-white dark:border-dark-divider dark:text-white",
};

function paddingClass(
  variant: Variant,
  hideTrailingDecoration: boolean,
): string {
  if (variant === "primary" && !hideTrailingDecoration) return "pr-10";
  return "";
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  hideTrailingDecoration = false,
  onClick,
}: ButtonLinkProps) {
  const pad = paddingClass(variant, hideTrailingDecoration);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group ${base} ${variants[variant]} ${pad} ${className}`}
    >
      {variant === "primary" && !hideTrailingDecoration && (
        <span
          className="pointer-events-none absolute right-[-40px] top-1/2 flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full bg-accent-gradient transition-transform duration-300 group-hover:rotate-45 max-md:hidden"
          aria-hidden
        >
          <span className="block h-3 w-3 bg-[url('/images/arrow-white.svg')] bg-contain bg-center bg-no-repeat" />
        </span>
      )}
      {variant === "outline" && (
        <>
          {!hideTrailingDecoration && (
            <span
              className="pointer-events-none absolute right-[-40px] top-1/2 hidden h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full bg-white md:flex"
              aria-hidden
            >
              <span className="block h-6 w-6 bg-[url('/images/arrow-accent.svg')] bg-contain bg-center bg-no-repeat" />
            </span>
          )}
          <span
            className="absolute inset-0 -z-10 scale-x-0 rounded-full bg-accent-gradient opacity-0 transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100"
            aria-hidden
          />
        </>
      )}
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

type ButtonNativeProps = {
  type?: "button" | "submit";
  children: ReactNode;
  variant?: Variant;
  className?: string;
  disabled?: boolean;
  /** Esconde o círculo/seta à direita (ex.: login na reserva). */
  hideTrailingDecoration?: boolean;
  onClick?: () => void;
};

export function ButtonNative({
  type = "button",
  children,
  variant = "primary",
  className = "",
  disabled,
  hideTrailingDecoration = false,
  onClick,
}: ButtonNativeProps) {
  const pad = paddingClass(variant, hideTrailingDecoration);

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`group ${base} ${variants[variant]} ${pad} ${disabled ? "pointer-events-none opacity-50" : ""} ${className}`}
    >
      {variant === "primary" && !hideTrailingDecoration && (
        <span
          className="pointer-events-none absolute right-[-40px] top-1/2 flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full bg-accent-gradient transition-transform duration-300 group-hover:rotate-45 max-md:hidden"
          aria-hidden
        >
          <span className="block h-3 w-3 bg-[url('/images/arrow-white.svg')] bg-contain bg-center bg-no-repeat" />
        </span>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
