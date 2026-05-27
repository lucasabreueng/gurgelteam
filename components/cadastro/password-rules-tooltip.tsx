import { HiInformationCircle } from "react-icons/hi2";
import { AuthServiceMock } from "@/services/auth/authServiceMock";

const rules = AuthServiceMock.getPasswordRuleLabels();

export function PasswordRulesTooltip() {
  return (
    <div className="group relative inline-flex">
      <button
        type="button"
        className="rounded-full p-0.5 text-neutral-400 transition hover:text-[#0d1f3c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
        aria-label="Requisitos da senha"
      >
        <HiInformationCircle className="h-4 w-4" aria-hidden />
      </button>
      <div
        role="tooltip"
        className="pointer-events-none invisible absolute left-1/2 top-[calc(100%+6px)] z-20 w-[min(100vw-2rem,240px)] -translate-x-1/2 rounded-xl border border-[rgba(17,17,17,0.1)] bg-white px-3 py-2.5 text-left opacity-0 shadow-[0_8px_24px_rgba(13,31,60,0.12)] transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 sm:left-full sm:top-1/2 sm:w-[220px] sm:translate-x-2 sm:-translate-y-1/2"
      >
        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
          Requisitos da senha
        </p>
        <ul className="mt-2 space-y-1">
          {rules.map((rule) => (
            <li
              key={rule}
              className="text-[12px] leading-snug text-neutral-700"
            >
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
