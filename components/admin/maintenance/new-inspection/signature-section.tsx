"use client";

import { useInspectionTemplate } from "@/lib/query/hooks/use-inspection-template";

import { HiFingerPrint } from "react-icons/hi2";

type SignatureStaff = {
  mechanic: string;
  supervisor: string;
  signedAt: string;
};

type Props = {
  responsible: string;
};

export function SignatureSection({ responsible }: Props) {
  const { data: template, isLoading } = useInspectionTemplate();
  const staff = (template?.signatureStaff ?? {
    mechanic: "—",
    supervisor: "—",
    signedAt: "—",
  }) as SignatureStaff;

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
        <div className="h-32 animate-pulse rounded-xl bg-[#fafbfc]" />
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-[#0d1f3c]">
        Assinatura / Responsável
      </h2>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-[#fafbfc] px-3 py-2.5 ring-1 ring-[rgba(17,17,17,0.06)]">
          <dt className="text-[10px] font-bold uppercase text-neutral-500">
            Responsável técnico
          </dt>
          <dd className="mt-1 text-sm font-bold text-[#0d1f3c]">
            {responsible}
          </dd>
        </div>
        <div className="rounded-xl bg-[#fafbfc] px-3 py-2.5 ring-1 ring-[rgba(17,17,17,0.06)]">
          <dt className="text-[10px] font-bold uppercase text-neutral-500">
            Supervisor operacional
          </dt>
          <dd className="mt-1 text-sm font-bold text-[#0d1f3c]">
            {staff.supervisor}
          </dd>
        </div>
        <div className="rounded-xl bg-[#fafbfc] px-3 py-2.5 ring-1 ring-[rgba(17,17,17,0.06)]">
          <dt className="text-[10px] font-bold uppercase text-neutral-500">
            Mecânico
          </dt>
          <dd className="mt-1 text-sm font-bold text-[#0d1f3c]">
            {staff.mechanic}
          </dd>
        </div>
        <div className="rounded-xl bg-[#fafbfc] px-3 py-2.5 ring-1 ring-[rgba(17,17,17,0.06)]">
          <dt className="text-[10px] font-bold uppercase text-neutral-500">
            Data e hora
          </dt>
          <dd className="mt-1 text-sm font-bold text-[#0d1f3c]">
            {staff.signedAt}
          </dd>
        </div>
      </dl>
      <div className="mt-4 flex items-center gap-4 rounded-xl border-2 border-dashed border-neutral-300 bg-[#fafbfc] px-4 py-6">
        <HiFingerPrint className="h-10 w-10 text-neutral-400" aria-hidden />
        <div>
          <p className="text-xs font-bold uppercase text-neutral-500">
            Assinatura digital
          </p>
          <p className="mt-1 font-serif text-2xl italic text-[#0d1f3c]/80">
            {responsible.split(" ")[0]} Silva
          </p>
          <p className="mt-1 text-[10px] text-neutral-500">
            Mock — toque para assinar em produção
          </p>
        </div>
      </div>
    </section>
  );
}
