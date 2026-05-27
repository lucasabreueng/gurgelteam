import Image from "next/image";
import { HiOutlineCheckCircle, HiMinusCircle } from "react-icons/hi2";

type FeedbackData = {
  instructorName: string;
  instructorPhoto: string;
  dateLabel: string;
  commentary: string;
  strengths: readonly string[];
  improve: readonly string[];
};

type Props = FeedbackData & { className?: string };

export function InstructorFeedback({
  instructorName,
  instructorPhoto,
  dateLabel,
  commentary,
  strengths,
  improve,
  className = "",
}: Props) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-7 ${className}`}
    >
      <div className="flex shrink-0 items-start gap-4">
        <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md ring-2 ring-accent/90">
          <Image
            src={instructorPhoto}
            alt={instructorName}
            fill
            className="object-cover"
            sizes="52px"
          />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-2 gap-y-1">
            <h3 className="text-xl font-bold text-[#0d1f3c]">
              {instructorName}
            </h3>
          </div>
          <span className="mt-3 inline-flex items-center rounded-md bg-[rgba(13,31,60,0.06)] px-2 py-0.5 text-[11px] font-semibold text-neutral-600">
            📅 Avaliação realizada dia {dateLabel}
          </span>
        </div>
      </div>

      <blockquote className="relative mt-6 shrink-0 rounded-xl border-l-4 border-accent bg-neutral-50/80 px-4 py-3 text-[15px] leading-relaxed text-[#111]/90 italic">
        {commentary}
      </blockquote>

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Pontos fortes na pista 🏁
            </p>
            <ul className="mt-3 space-y-3">
              {strengths.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 text-sm text-neutral-800"
                >
                  <HiOutlineCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-900/90">
              Pontos para evoluir
            </p>
            <ul className="mt-3 space-y-3">
              {improve.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 text-sm text-neutral-800"
                >
                  <HiMinusCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
