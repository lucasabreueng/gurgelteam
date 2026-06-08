import Image from "next/image";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi2";
import { CadastroEmailConfirmForm } from "./cadastro-email-confirm-form";

type Props = {
  email: string;
};

export function CadastroEmailConfirmPage({ email }: Props) {
  const normalizedEmail = email.trim().toLowerCase();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6f8] px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-[420px]">
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

        {normalizedEmail ? (
          <CadastroEmailConfirmForm email={normalizedEmail} />
        ) : (
          <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 text-center shadow-[0_8px_32px_rgba(13,31,60,0.06)] sm:p-8">
            <p className="text-[14px] text-neutral-600">
              E-mail não informado. Conclua o cadastro primeiro.
            </p>
            <Link
              href="/cadastro"
              className="mt-4 inline-block font-semibold text-[#c41e3a] hover:underline"
            >
              Ir para cadastro
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
