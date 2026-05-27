"use client";

import { useCallback, useMemo, useState } from "react";
import { addDays, isBefore, startOfDay, startOfToday } from "date-fns";
import { KartReservaDayPicker } from "@/components/kart-reserva-day-picker";
import { ButtonNative } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { WideSection } from "@/components/ui/container";
import {
  AGENDA_BY_WEEKDAY,
  PERFIL_LETRA_TITLE,
  slotBelongsToCat,
  slotLetraPerfil,
  type AgendaSlot,
  type KartCat,
  type PilotoLetra,
  type WeekdayKey,
} from "@/lib/kart-reserva-schedule";

const WEEKDAY_KEYS = [
  "domingo",
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
] as const;

const CAT_LABEL: Record<KartCat, string> = {
  cadete: "Cadete",
  f400: "F400",
  "125cc": "125cc",
};

const CAT_ORDER: KartCat[] = ["cadete", "f400", "125cc"];

/** Conta fictícia — autenticação só no cliente (sem API). */
const MOCK_LOGIN = {
  email: "demo@gurgelteam.com.br",
  password: "gurgel2024",
} as const;

const MOCK_SESSION_KEY = "gurgel-reserva-demo-auth";

type Selection = {
  iso: string | null;
  weekdayKey: string | null;
  cat: KartCat | null;
  slotId: string | null;
  slotRange: string | null;
  slotDescription: string | null;
  dateLabel: string | null;
  email: string | null;
};

function dateToIsoLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dateToWeekdayKey(d: Date) {
  return WEEKDAY_KEYS[d.getDay()];
}

function formatDateLongPt(d: Date) {
  const s = d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Segundas-feiras (getDay === 1) estão sempre indisponíveis para reserva. */
function isClosedMonday(d: Date) {
  return d.getDay() === 1;
}

/** Primeiro dia a partir de `d` (inclusive) que não é segunda nem anterior a hoje. */
function firstBookableDate(d: Date) {
  let x = startOfDay(d);
  const min = startOfToday();
  if (isBefore(x, min)) x = min;
  while (isClosedMonday(x)) {
    x = addDays(x, 1);
  }
  return x;
}

function LetraPerfil({ letra }: { letra: PilotoLetra }) {
  return (
    <span
      title={PERFIL_LETRA_TITLE[letra]}
      className="flex h-7 w-7 shrink-0 items-center justify-center self-start rounded-lg border border-divider bg-secondary text-[11px] font-bold text-accent dark:bg-[#141414]"
      aria-label={PERFIL_LETRA_TITLE[letra]}
    >
      {letra}
    </span>
  );
}

function Breadcrumb({
  step,
}: {
  step: 1 | 2 | 3;
}) {
  const items = [
    { n: 1 as const, label: "Data e horário" },
    { n: 2 as const, label: "Login na conta" },
    { n: 3 as const, label: "Confirmar agendamento" },
  ];
  return (
    <nav
      className="mt-7 flex w-full flex-wrap items-center justify-center gap-2"
      aria-label="Etapas da reserva"
    >
      <ol className="flex flex-wrap items-center justify-center gap-2">
        {items.map((it, idx) => (
          <li key={it.n} className="flex items-center">
            {idx > 0 ? (
              <span
                className="mx-1 h-px w-5 shrink-0 bg-divider"
                aria-hidden
              />
            ) : null}
            <span
              className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-[13px] font-medium leading-tight ${
                step === it.n
                  ? "border-accent bg-background text-primary dark:bg-[#080808]"
                  : step > it.n
                    ? "border-divider bg-secondary text-foreground opacity-90 dark:bg-[#141414]"
                    : "border-divider bg-secondary text-foreground dark:bg-[#141414]"
              }`}
              aria-current={step === it.n ? "step" : undefined}
            >
              <span
                className={`flex h-[26px] min-w-[26px] items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
                  step === it.n || step > it.n
                    ? "bg-accent text-white"
                    : "bg-divider text-primary"
                }`}
              >
                {it.n}
              </span>
              <span>{it.label}</span>
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function KartReserva() {
  const initialDay = firstBookableDate(startOfToday());
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDay);
  const [calendarMonth, setCalendarMonth] = useState<Date>(initialDay);
  const [sel, setSel] = useState<Selection>(() => ({
    iso: dateToIsoLocal(initialDay),
    weekdayKey: dateToWeekdayKey(initialDay),
    cat: null,
    slotId: null,
    slotRange: null,
    slotDescription: null,
    dateLabel: formatDateLongPt(initialDay),
    email: null,
  }));

  const applyDate = useCallback((dateObj: Date) => {
    setSelectedDate(dateObj);
    const key = dateToWeekdayKey(dateObj);
    const iso = dateToIsoLocal(dateObj);
    setSel((prev) => ({
      ...prev,
      iso,
      weekdayKey: key,
      dateLabel: formatDateLongPt(dateObj),
      cat: null,
      slotId: null,
      slotRange: null,
      slotDescription: null,
    }));
  }, []);

  const slotsForDay = useMemo(() => {
    const key = sel.weekdayKey as WeekdayKey | null;
    if (!key) return [];
    return AGENDA_BY_WEEKDAY[key] ?? [];
  }, [sel.weekdayKey]);

  const slotsByCat = useMemo(() => {
    const out: Record<KartCat, AgendaSlot[]> = {
      cadete: [],
      f400: [],
      "125cc": [],
    };
    for (const slot of slotsForDay) {
      for (const cat of CAT_ORDER) {
        if (slotBelongsToCat(slot.description, cat)) {
          out[cat].push(slot);
        }
      }
    }
    return out;
  }, [slotsForDay]);

  const onPickSlot = (cat: KartCat, slot: AgendaSlot) => {
    if (!sel.iso || !sel.weekdayKey) return;
    setSel((p) => ({
      ...p,
      cat,
      slotId: slot.id,
      slotRange: slot.range,
      slotDescription: slot.description,
    }));
  };

  const onContinue = () => {
    if (!sel.slotId || !sel.slotRange || !sel.cat) return;
    setLoginError(null);
    setStep(2);
  };

  const onLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim().toLowerCase();
    const pass = String(fd.get("password") ?? "");
    if (!email || !pass) {
      setLoginError("Preencha e-mail e senha.");
      return;
    }
    if (email !== MOCK_LOGIN.email || pass !== MOCK_LOGIN.password) {
      setLoginError(
        "E-mail ou senha incorretos. Use a conta de demonstração acima.",
      );
      return;
    }
    try {
      sessionStorage.setItem(
        MOCK_SESSION_KEY,
        JSON.stringify({
          email,
          displayName: "Piloto demonstração",
          loggedAt: new Date().toISOString(),
        }),
      );
    } catch {
      /* ignore */
    }
    setSel((p) => ({ ...p, email }));
    setStep(3);
  };

  const onConfirm = () => {
    const msg = [
      "Demonstração — pedido registado:",
      "",
      sel.dateLabel ?? "",
      `${sel.slotRange ?? ""} — ${sel.slotDescription ?? ""}`,
      `Categoria: ${sel.cat ? CAT_LABEL[sel.cat] : ""}`,
      `Conta: ${sel.email ?? ""}`,
    ].join("\n");
    window.alert(msg);
    setLoginError(null);
    try {
      sessionStorage.removeItem(MOCK_SESSION_KEY);
    } catch {
      /* ignore */
    }
    const next = firstBookableDate(startOfToday());
    setSelectedDate(next);
    setCalendarMonth(next);
    setStep(1);
    setSel({
      iso: dateToIsoLocal(next),
      weekdayKey: dateToWeekdayKey(next),
      cat: null,
      slotId: null,
      slotRange: null,
      slotDescription: null,
      dateLabel: formatDateLongPt(next),
      email: null,
    });
  };

  const slotColumn = (cat: KartCat, label: string) => {
    const list = slotsByCat[cat];
    return (
      <div>
        <h4 className="mb-4 text-lg font-semibold text-primary dark:text-white">
          {label}
        </h4>
        <ul className="space-y-2">
          {list.length === 0 ? (
            <li className="text-sm text-foreground">
              Nenhuma vaga nesta categoria para este dia.
            </li>
          ) : (
            list.map((slot) => {
              const letra = slotLetraPerfil(slot.description);
              const active =
                sel.cat === cat &&
                sel.slotId === slot.id &&
                sel.iso !== null;
              return (
                <li key={`${slot.id}-${cat}`}>
                  <button
                    type="button"
                    onClick={() => onPickSlot(cat, slot)}
                    className={`flex w-full flex-row items-center gap-3 rounded-xl border-2 px-3 py-3 text-left transition ${
                      active
                        ? "border-accent bg-[rgba(13,31,60,0.08)] text-accent dark:bg-[rgba(255,255,255,0.06)]"
                        : "border-divider bg-background hover:border-[rgba(13,31,60,0.45)] dark:bg-[#080808]"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="block text-base font-semibold text-primary dark:text-white">
                        {slot.range}
                      </span>
                      <span className="mt-1 block text-xs text-foreground">
                        {slot.vagas} vaga{slot.vagas !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <LetraPerfil letra={letra} />
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    );
  };

  return (
    <section className="py-24 md:py-32">
      <WideSection className="bg-secondary px-4 py-16 md:px-8 md:py-24">
        <Container>
          <div className="mx-auto mb-12 max-w-[760px] text-center">
            <p className="section-kicker">Reserva</p>
            <div className="group">
              <h1 className="heading-gradient mt-4 text-3xl font-semibold tracking-tight text-primary md:text-[46px] dark:text-white">
                Escolha a <span>data</span> e o horário da sua aula
              </h1>
            </div>
            <Breadcrumb step={step} />
          </div>

          <div className="mx-auto max-w-6xl">
            {step === 1 ? (
              <>
                <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
                  <div className="lg:col-span-5">
                    <div className="sticky top-24 rounded-card border border-divider bg-secondary p-5 dark:bg-[#141414]">
                      <h2 className="mb-1 text-xl font-semibold text-primary dark:text-white">
                        Data da aula
                      </h2>
                      <p className="mb-4 text-sm text-foreground">
                        Toque num dia disponível para ver os horários.
                      </p>
                      <div
                        className="w-full"
                        role="region"
                        aria-label="Calendário para escolher a data da aula"
                      >
                        <KartReservaDayPicker
                          selected={selectedDate}
                          onSelect={applyDate}
                          month={calendarMonth}
                          onMonthChange={setCalendarMonth}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-7">
                    <h2 className="mb-2 text-xl font-semibold text-primary dark:text-white">
                      Horários disponíveis
                    </h2>
                    <p className="mb-8 text-foreground">
                      {sel.dateLabel ?? "Selecione uma data no calendário."}
                    </p>
                    <div className="grid gap-8 md:grid-cols-3">
                      {slotColumn("cadete", CAT_LABEL.cadete)}
                      {slotColumn("f400", CAT_LABEL.f400)}
                      {slotColumn("125cc", CAT_LABEL["125cc"])}
                    </div>
                    <div
                      className="mt-6 rounded-xl border border-divider bg-background px-4 py-3 text-xs leading-relaxed text-foreground dark:bg-[#080808]"
                      role="note"
                    >
                      <p className="font-semibold text-primary dark:text-white">
                        Legenda
                      </p>
                      <p className="mt-2">
                        Cada horário tem{" "}
                        <strong className="text-primary dark:text-white">
                          um único
                        </strong>{" "}
                        tipo de piloto:{" "}
                        <strong className="text-accent">I</strong> — iniciante;{" "}
                        <strong className="text-accent">E</strong> — experiente;{" "}
                        <strong className="text-accent">C</strong> — competidor
                        (ex.: campeonato). O perfil concreto do piloto continua a
                        ser definido pelo operador no cadastro.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <ButtonNative
                    disabled={!sel.cat || !sel.slotId || !sel.slotRange}
                    onClick={onContinue}
                  >
                    Continuar
                  </ButtonNative>
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <div className="mx-auto max-w-md">
                <div className="rounded-card border border-divider bg-secondary p-7 dark:bg-[#141414]">
                  <h2 className="mb-2 text-xl font-semibold text-primary dark:text-white">
                    Entre na sua conta
                  </h2>
                  <p className="mb-4 rounded-xl border border-divider bg-background px-3 py-2.5 text-xs leading-relaxed text-foreground dark:bg-[#080808]">
                    <span className="font-semibold text-primary dark:text-white">
                      Demonstração:
                    </span>{" "}
                    e-mail{" "}
                    <code className="text-[13px] text-accent">
                      {MOCK_LOGIN.email}
                    </code>{" "}
                    · senha{" "}
                    <code className="text-[13px] text-accent">
                      {MOCK_LOGIN.password}
                    </code>
                  </p>
                  {loginError ? (
                    <p
                      className="mb-4 text-sm font-medium text-red-600 dark:text-red-400"
                      role="alert"
                    >
                      {loginError}
                    </p>
                  ) : null}
                  <form onSubmit={onLogin}>
                    <div className="mb-4">
                      <label
                        htmlFor="kartLoginEmail"
                        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground"
                      >
                        E-mail
                      </label>
                      <input
                        id="kartLoginEmail"
                        name="email"
                        type="email"
                        required
                        autoComplete="username"
                        placeholder="nome@email.com"
                        className="w-full rounded-xl border-2 border-divider bg-background px-3.5 py-3 text-[15px] font-medium text-primary outline-none transition focus:border-accent dark:bg-[#080808]"
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="kartLoginPassword"
                        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground"
                      >
                        Senha
                      </label>
                      <input
                        id="kartLoginPassword"
                        name="password"
                        type="password"
                        required
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="w-full rounded-xl border-2 border-divider bg-background px-3.5 py-3 text-[15px] font-medium text-primary outline-none transition focus:border-accent dark:bg-[#080808]"
                      />
                    </div>
                    <div className="flex justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginError(null);
                          setStep(1);
                        }}
                        className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-divider bg-background px-5 text-[15px] font-semibold text-primary transition hover:border-accent hover:text-accent dark:bg-[#080808]"
                      >
                        Voltar
                      </button>
                      <ButtonNative type="submit" hideTrailingDecoration>
                        Entrar
                      </ButtonNative>
                    </div>
                  </form>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="mx-auto max-w-xl">
                <div className="rounded-card border border-divider bg-secondary p-7 dark:bg-[#141414]">
                  <h2 className="mb-2 text-xl font-semibold text-primary dark:text-white">
                    Confirmar agendamento
                  </h2>
                  <p className="mb-6 text-sm leading-relaxed text-foreground">
                    Revise os dados abaixo. Em produção, este passo enviaria o
                    pedido à API.
                  </p>
                  <ul className="mb-6 overflow-hidden rounded-2xl border border-divider bg-background dark:bg-[#080808]">
                    {(
                      [
                        ["Data", sel.dateLabel],
                        ["Horário", sel.slotRange],
                        ["Programação", sel.slotDescription],
                        [
                          "Categoria",
                          sel.cat ? CAT_LABEL[sel.cat] : null,
                        ],
                        ["Conta", sel.email],
                      ] as const
                    ).map(([k, v]) => (
                      <li
                        key={k}
                        className="flex items-baseline justify-between gap-4 border-b border-divider px-[18px] py-3.5 text-[15px] last:border-b-0"
                      >
                        <span className="font-semibold text-foreground">
                          {k}
                        </span>
                        <span className="max-w-[65%] text-right font-semibold text-primary dark:text-white">
                          {v ?? "—"}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-divider bg-background px-5 text-[15px] font-semibold text-primary transition hover:border-accent hover:text-accent dark:bg-[#080808]"
                    >
                      Voltar
                    </button>
                    <ButtonNative type="button" onClick={onConfirm}>
                      Confirmar agendamento
                    </ButtonNative>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </Container>
      </WideSection>
    </section>
  );
}
