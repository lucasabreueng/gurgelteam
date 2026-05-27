type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function TechnicalDiagnosis({ value, onChange }: Props) {
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-[#0d1f3c]">
        Diagnóstico da inspeção
      </h2>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder="Descreva a condição geral, problemas encontrados e recomendação técnica."
        className="mt-3 w-full resize-y rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] px-4 py-3 text-sm leading-relaxed text-[#0d1f3c] outline-none transition focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
      />
    </section>
  );
}
