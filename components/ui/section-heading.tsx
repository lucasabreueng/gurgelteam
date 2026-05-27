import { type ReactNode } from "react";

type Align = "left" | "center";

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  className = "",
}: {
  kicker?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: Align;
  className?: string;
}) {
  const wrap =
    align === "center"
      ? "mx-auto max-w-[700px] text-center"
      : "max-w-[900px] text-left";

  return (
    <div className={`mb-10 ${wrap} ${className}`}>
      {kicker ? <p className="section-kicker">{kicker}</p> : null}
      <div className="group">
        <h2 className="heading-gradient font-semibold tracking-tight text-[clamp(1.75rem,4vw,2.875rem)] leading-tight text-primary dark:text-white">
          {title}
        </h2>
      </div>
      {description ? (
        <div className="mt-5 text-base leading-relaxed text-foreground">
          {description}
        </div>
      ) : null}
    </div>
  );
}
