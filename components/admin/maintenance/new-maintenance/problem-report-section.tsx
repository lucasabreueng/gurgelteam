"use client";

type Props = {
  problem: string;
  identifiedBy: string;
  session: string;
  dateTime: string;
  onProblemChange: (v: string) => void;
  onIdentifiedByChange: (v: string) => void;
  onSessionChange: (v: string) => void;
};

export function ProblemReportSection({
  problem,
  identifiedBy,
  session,
  dateTime,
  onProblemChange,
  onIdentifiedByChange,
  onSessionChange,
}: Props) {
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-[#0d1f3c]">Problema identificado</h2>
      <textarea
        value={problem}
        onChange={(e) => onProblemChange(e.target.value)}
        rows={4}
        placeholder="Descreva o problema encontrado no kart."
        className="mt-3 w-full resize-y rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] px-4 py-3 text-sm text-[#0d1f3c] outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="text-[10px] font-bold uppercase text-neutral-500">
            Quem identificou
          </span>
          <input
            type="text"
            value={identifiedBy}
            onChange={(e) => onIdentifiedByChange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] px-3 py-2.5 text-sm font-semibold"
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-bold uppercase text-neutral-500">
            Sessão relacionada
          </span>
          <input
            type="text"
            value={session}
            onChange={(e) => onSessionChange(e.target.value)}
            placeholder="Ex.: Pós-treino 21/05"
            className="mt-1 w-full rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] px-3 py-2.5 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-bold uppercase text-neutral-500">
            Data / hora
          </span>
          <input
            type="text"
            readOnly
            value={dateTime}
            className="mt-1 w-full rounded-xl border border-[rgba(17,17,17,0.06)] bg-neutral-50 px-3 py-2.5 text-sm tabular-nums text-neutral-600"
          />
        </label>
      </div>
    </section>
  );
}
