import { HiSparkles } from "react-icons/hi2";

type Props = { message: string };

export function SmartSuggestionCard({ message }: Props) {
  return (
    <section className="rounded-xl border border-[#0d1f3c]/15 bg-gradient-to-r from-[#0d1f3c]/5 to-white p-4 ring-1 ring-[#0d1f3c]/10">
      <div className="flex gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0d1f3c] text-white">
          <HiSparkles className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Sugestão inteligente
          </p>
          <p className="mt-1 text-sm font-semibold text-[#0d1f3c]">{message}</p>
        </div>
      </div>
    </section>
  );
}
