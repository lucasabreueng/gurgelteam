import { settingsTextareaClass } from "../../settings/settings-section";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function InspectionNotes({ value, onChange }: Props) {
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm md:p-5">
      <label className="block">
        <span className="text-sm font-bold text-[#0d1f3c]">
          Observações técnicas
        </span>
        <textarea
          className={`${settingsTextareaClass} mt-2 min-h-[120px]`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Corrente com desgaste acima do ideal…"
        />
      </label>
    </section>
  );
}
