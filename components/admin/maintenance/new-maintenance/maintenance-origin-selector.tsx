"use client";

import { NewMaintenanceServiceMock } from "@/services/maintenance/newMaintenanceServiceMock";

import type { MaintenanceOriginKey } from "@/lib/contracts/maintenance";



type Props = {
  selected: MaintenanceOriginKey;
  onSelect: (key: MaintenanceOriginKey) => void;
};

export function MaintenanceOriginSelector({ selected, onSelect }: Props) {
  const link = NewMaintenanceServiceMock.getOriginLinkMock()[selected];

  return (
    <section>
      <h2 className="text-sm font-bold text-[#0d1f3c]">Origem da manutenção</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {NewMaintenanceServiceMock.getOriginOptions().map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onSelect(opt.key)}
            className={`rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-wide transition ${
              selected === opt.key
                ? "bg-[#0d1f3c] text-white shadow-sm"
                : "bg-white text-neutral-600 ring-1 ring-[rgba(17,17,17,0.1)] hover:ring-accent/30"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {link ? (
        <div className="mt-3 rounded-xl border border-sky-200/60 bg-sky-50 px-4 py-3 text-sm">
          <p className="font-bold text-sky-900">Vínculo automático: {link.ref}</p>
          <p className="mt-1 text-xs text-sky-800">{link.detail}</p>
        </div>
      ) : null}
    </section>
  );
}
