import Image from "next/image";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi2";
import { SecurityCard } from "@/components/login/security-card";
import { CadastroForm } from "./cadastro-form";

export function CadastroPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6f8] px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-[480px]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo.svg"
              alt="Gurgel Team"
              width={140}
              height={40}
              className="h-9 w-auto"
              priority
            />
          </Link>
          <Link
            href="/login"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[rgba(17,17,17,0.12)] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#0d1f3c] shadow-sm transition hover:border-accent/30 hover:bg-neutral-50"
          >
            <HiArrowLeft className="h-4 w-4 text-accent" aria-hidden />
            Voltar ao login
          </Link>
        </div>

        <CadastroForm />
        <div className="mt-6">
          <SecurityCard />
        </div>
      </div>
    </div>
  );
}
