import Image from "next/image";

export function LoginFooter() {
  return (
    <footer className="mt-8 border-t border-[rgba(17,17,17,0.08)] pt-6">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <Image
          src="/images/logo.svg"
          alt="Gurgel Team"
          width={120}
          height={32}
          className="h-7 w-auto opacity-90"
        />
        <p className="text-[12px] text-neutral-500">
          © 2025 Gurgel Team. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
