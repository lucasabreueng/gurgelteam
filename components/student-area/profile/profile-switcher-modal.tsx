"use client";

import Image from "next/image";
import { AppModal } from "@/components/ui/app-modal";
import type { SwitcherOption } from "./profile-switcher";

type Props = {
  open: boolean;
  options: SwitcherOption[];
  activeId: string;
  onClose: () => void;
  onSelect: (id: string) => void;
};

export function ProfileSwitcherModal({
  open,
  options,
  activeId,
  onClose,
  onSelect,
}: Props) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Mudar perfil"
      description="Selecione o perfil que deseja gerenciar."
      maxWidth="md"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl border border-[rgba(17,17,17,0.1)] bg-white py-3 text-[12px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-accent/30"
        >
          Fechar
        </button>
      }
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const active = opt.id === activeId;
          return (
            <li key={opt.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(opt.id);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-accent/40 bg-accent/[0.04] ring-1 ring-accent/20"
                    : "border-[rgba(17,17,17,0.08)] bg-[#fafbfc] hover:border-accent/25 hover:bg-white"
                }`}
              >
                <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={opt.avatarUrl || "/images/team-4.png"}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-semibold text-[#0d1f3c]">
                    {opt.label}
                  </span>
                  <span className="block truncate text-[12px] text-neutral-500">
                    {opt.sublabel}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </AppModal>
  );
}
