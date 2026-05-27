type Props = {
  name: string;
  description: string;
  status: "conectado" | "pendente" | "desconectado";
  onConfigure?: () => void;
};

function statusUi(status: Props["status"]) {
  switch (status) {
    case "conectado":
      return {
        label: "Conectado",
        dot: "bg-emerald-500",
        ring: "ring-emerald-200/80",
        bg: "bg-emerald-50 text-emerald-800",
      };
    case "pendente":
      return {
        label: "Pendente",
        dot: "bg-amber-500",
        ring: "ring-amber-200/80",
        bg: "bg-amber-50 text-amber-800",
      };
    default:
      return {
        label: "Desconectado",
        dot: "bg-neutral-400",
        ring: "ring-neutral-200/80",
        bg: "bg-neutral-100 text-neutral-600",
      };
  }
}

export function IntegrationCard({
  name,
  description,
  status,
  onConfigure,
}: Props) {
  const ui = statusUi(status);

  return (
    <article className="flex flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm transition hover:shadow-md md:p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-[#0d1f3c]">{name}</h3>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ring-1 ${ui.ring} ${ui.bg}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${ui.dot}`} />
          {ui.label}
        </span>
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
        {description}
      </p>
      <button
        type="button"
        onClick={onConfigure}
        className="mt-5 w-full rounded-xl border border-[rgba(13,31,60,0.2)] py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-accent hover:bg-[#fafbfc]"
      >
        Configurar
      </button>
    </article>
  );
}
