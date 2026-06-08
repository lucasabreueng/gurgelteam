import { type ReactNode } from "react";

type Align = "left" | "center";
type Tone = "default" | "on-dark";
type HeadingLevel = "h1" | "h2";

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  tone = "default",
  headingLevel = "h2",
  className = "",
}: {
  kicker?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: Align;
  tone?: Tone;
  headingLevel?: HeadingLevel;
  className?: string;
}) {
  const wrap =
    align === "center"
      ? "mx-auto max-w-[700px] text-center"
      : "max-w-[900px] text-left";

  const onDark = tone === "on-dark";
  const kickerClass = onDark
    ? "section-kicker text-white bg-[url('/images/icon-sparkle-white.svg')]"
    : "section-kicker";
  const headingClass = onDark
    ? "font-semibold tracking-tight text-[clamp(1.75rem,4vw,4.875rem)] leading-[1.1] text-white"
    : "heading-gradient font-semibold tracking-tight text-[clamp(1.75rem,4vw,2.875rem)] leading-tight text-primary dark:text-white";
  const descriptionClass = onDark
    ? "mt-5 text-base leading-relaxed text-white/90"
    : "mt-5 text-base leading-relaxed text-foreground";

  const HeadingTag = headingLevel;

  return (
    <div className={`mb-10 ${wrap} ${className}`}>
      {kicker ? <p className={kickerClass}>{kicker}</p> : null}
      <div className="group">
        <HeadingTag className={headingClass}>{title}</HeadingTag>
      </div>
      {description ? (
        <div className={descriptionClass}>{description}</div>
      ) : null}
    </div>
  );
}
