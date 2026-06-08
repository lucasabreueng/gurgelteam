import { HiExclamationTriangle } from "react-icons/hi2";

export function GurgelClassAlerts({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null;

  return (
    <section className="rounded-xl border border-[var(--ds-warning-border)] bg-[var(--ds-warning-bg)] p-4">
      <div className="flex items-center gap-2">
        <HiExclamationTriangle
          className="h-5 w-5 text-[var(--ds-warning-text)]"
          aria-hidden
        />
        <h3 className="text-xs font-bold uppercase text-[var(--ds-warning-text)]">
          Alertas operacionais
        </h3>
      </div>
      <ul className="mt-2 space-y-1.5">
        {messages.map((msg) => (
          <li key={msg} className="text-xs font-medium text-[var(--ds-warning-text)]">
            {msg}
          </li>
        ))}
      </ul>
    </section>
  );
}
