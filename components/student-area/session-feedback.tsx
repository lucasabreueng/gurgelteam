import Image from "next/image";
import { HiCheckCircle, HiExclamationCircle } from "react-icons/hi2";

export type SessionFeedbackProps = {
  authorName: string;
  authorPhoto: string;
  dateLabel: string;
  commentary: string;
  strengths: string[];
  improve: string[];
  className?: string;
};

export function SessionFeedback({
  authorName,
  authorPhoto,
  dateLabel,
  commentary,
  strengths,
  improve,
  className = "",
}: SessionFeedbackProps) {
  return (
    <article
      className={`flex h-full flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.06)] md:p-6 ${className}`}
    >
      <header className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl ring-2 ring-[rgba(17,17,17,0.06)]">
          <Image
            src={authorPhoto}
            alt={authorName}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Feedback da sessão
          </p>
          <p className="truncate text-base font-black text-[#0d1f3c]">
            {authorName}
          </p>
          <p className="text-xs text-neutral-500">{dateLabel}</p>
        </div>
      </header>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-neutral-700">
        {commentary}
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase text-emerald-700">
            <HiCheckCircle className="h-4 w-4" aria-hidden />
            Pontos fortes
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-neutral-700">
            {strengths.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-emerald-600" aria-hidden>
                  •
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase text-amber-700">
            <HiExclamationCircle className="h-4 w-4" aria-hidden />
            A evoluir
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-neutral-700">
            {improve.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-amber-600" aria-hidden>
                  •
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
