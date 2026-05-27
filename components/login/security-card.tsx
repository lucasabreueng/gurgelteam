import { HiShieldCheck } from "react-icons/hi2";

export function SecurityCard() {
  return (
    <div className="flex gap-4 rounded-2xl border border-[rgba(17,17,17,0.08)] bg-[#f8fafc] px-5 py-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <HiShieldCheck className="h-6 w-6" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-[14px] font-bold text-[#0d1f3c]">Acesso 100% seguro</p>
        <p className="mt-1 text-[13px] leading-relaxed text-neutral-600">
          Seus dados estão protegidos com criptografia de ponta a ponta.
        </p>
      </div>
    </div>
  );
}
