import { settingsTextareaClass } from "../../settings/settings-section";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function TechnicalNotes({ value, onChange }: Props) {
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4">
      <label className="block">
        <span className="text-sm font-bold text-[#0d1f3c]">
          Observações técnicas
        </span>
        <textarea
          className={`${settingsTextareaClass} mt-2 min-h-[100px]`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Descreva o motivo da troca, desgaste encontrado ou detalhe da instalação."
        />
      </label>
    </section>
  );
}
