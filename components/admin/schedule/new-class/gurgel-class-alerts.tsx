import { HiExclamationTriangle } from "react-icons/hi2";

export function GurgelClassAlerts({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null;

  return (
    <section className="rounded-xl border border-amber-200/60 bg-amber-50/80 p-4">
      <div className="flex items-center gap-2">
        <HiExclamationTriangle className="h-5 w-5 text-amber-700" aria-hidden />
        <h3 className="text-xs font-bold uppercase text-amber-900">
          Alertas operacionais
        </h3>
      </div>
      <ul className="mt-2 space-y-1.5">
        {messages.map((msg) => (
          <li key={msg} className="text-xs font-medium text-amber-950">
            {msg}
          </li>
        ))}
      </ul>
    </section>
  );
}
