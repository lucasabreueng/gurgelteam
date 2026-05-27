import { PartsServiceMock } from "@/services/parts/partsServiceMock";
import { HiSparkles } from "react-icons/hi2";


export function SmartPartSuggestions() {
  return (
    <section className="rounded-2xl border border-accent/15 bg-[#0d1f3c]/[0.03] p-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-[#0d1f3c]">
        <HiSparkles className="h-4 w-4 text-accent" aria-hidden />
        Sugestões inteligentes
      </h3>
      <ul className="mt-3 space-y-2">
        {PartsServiceMock.getSmartSuggestions().map((s, i) => (
          <li
            key={i}
            className="rounded-lg border border-[rgba(17,17,17,0.06)] bg-white px-3 py-2 text-sm text-neutral-700"
          >
            {s}
          </li>
        ))}
      </ul>
    </section>
  );
}
