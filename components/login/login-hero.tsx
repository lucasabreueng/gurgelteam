import Image from "next/image";
import Link from "next/link";

export function LoginHero() {
  return (
    <aside className="relative hidden min-h-[520px] flex-col overflow-hidden bg-accent lg:flex">
      <div className="relative z-[2] flex flex-col p-8 xl:p-10">
        <Link href="/" className="inline-block w-fit">
          <Image
            src="/images/logo-light.svg"
            alt="Gurgel Team"
            width={140}
            height={40}
            className="h-9 w-auto"
            priority
          />
        </Link>
        <h1 className="mt-10 max-w-md text-[32px] font-bold leading-[1.15] tracking-tight text-white xl:text-[38px]">
          Bem-vindo ao Gurgel Team
        </h1>
        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white">
          Entre na sua área e acompanhe sua evolução nas pistas.
        </p>
      </div>

      <div className="relative z-[1] mt-auto flex flex-1 flex-col justify-end">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-image.jpg"
            alt=""
            fill
            className="object-cover object-center opacity-90"
            sizes="(max-width: 1024px) 50vw, 600px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-accent/40" />
        </div>

        <div className="relative z-[2] w-full px-8 pb-8 xl:px-10 xl:pb-10">
          <div className="w-full rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
            <p className="text-lg font-semibold leading-snug text-white">
              Mais que aulas, formamos pilotos.
            </p>
            <p className="mt-3 text-[12px] font-bold uppercase tracking-[0.2em] text-white/70">
              Performance • Experiência • Evolução
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

/** Faixa compacta no mobile */
export function LoginHeroMobile() {
  return (
    <div className="relative h-36 overflow-hidden rounded-2xl bg-accent lg:hidden">
      <Image
        src="/images/hero-image.jpg"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-accent/95 via-accent/70 to-black/50" />
      <div className="relative flex h-full flex-col justify-center px-5">
        <Image
          src="/images/logo-light.svg"
          alt="Gurgel Team"
          width={120}
          height={32}
          className="h-7 w-auto"
        />
        <p className="mt-2 text-sm font-semibold text-white/90">
          Área do Aluno · Gurgel Team
        </p>
      </div>
    </div>
  );
}
