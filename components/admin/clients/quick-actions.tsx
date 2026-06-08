"use client";

import {
  HiBolt,
  HiCalendarDays,
  HiClipboardDocumentCheck,
  HiPaperAirplane,
} from "react-icons/hi2";
import { adminSubsectionTitleClass } from "@/lib/design";

const ACTIONS = [
  { icon: HiCalendarDays, label: "Agendar aula" },
  { icon: HiBolt, label: "Abrir telemetria" },
  { icon: HiClipboardDocumentCheck, label: "Registrar feedback" },
  { icon: HiPaperAirplane, label: "Enviar resultado" },
] as const;

export function QuickActions() {
  return (
    <section>
      <h3 className={adminSubsectionTitleClass}>Ações rápidas</h3>
      <p className="mt-1 text-sm text-neutral-600">
        Atalhos operacionais para este piloto.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            className="btn-outline-sm inline-flex items-center gap-2"
          >
            <action.icon className="h-4 w-4 shrink-0" aria-hidden />
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}
