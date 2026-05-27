/**
 * Agenda fixa por dia da semana (pista).
 * Segundas não entram — o calendário já bloqueia esse dia.
 */

export type WeekdayKey =
  | "domingo"
  | "segunda"
  | "terca"
  | "quarta"
  | "quinta"
  | "sexta"
  | "sabado";

export type KartCat = "cadete" | "f400" | "125cc";

export type SlotAudience = "iniciante" | "campeonato" | "normal";

/** Uma letra por horário: perfil de piloto daquele bloco. */
export type PilotoLetra = "I" | "E" | "C";

export type AgendaSlot = {
  /** Identificador estável para seleção na UI */
  id: string;
  /** Ex.: "08:00 – 09:00" */
  range: string;
  /** Texto da modalidade (como na operação) */
  description: string;
  /** Vagas fictícias para demonstração */
  vagas: number;
};

/** Classifica o slot (iniciante / campeonato / resto). */
export function slotAudience(description: string): SlotAudience {
  const d = description.toLowerCase();
  if (d.includes("(iniciante)")) return "iniciante";
  if (d.includes("(campeonato)")) return "campeonato";
  return "normal";
}

/**
 * Uma única letra por horário: I (iniciante), C (campeonato / competidor), E (demais).
 */
export function slotLetraPerfil(description: string): PilotoLetra {
  const a = slotAudience(description);
  if (a === "iniciante") return "I";
  if (a === "campeonato") return "C";
  return "E";
}

export const PERFIL_LETRA_TITLE: Record<PilotoLetra, string> = {
  I: "Horário para piloto iniciante",
  E: "Horário para piloto experiente",
  C: "Horário para piloto competidor",
};

/** Em que coluna da reserva o slot aparece (descrição pode cobrir mais de uma). */
export function slotBelongsToCat(
  description: string,
  cat: KartCat,
): boolean {
  const d = description.toLowerCase();
  if (cat === "125cc") return d.includes("125cc");
  if (cat === "f400") return d.includes("f400");
  if (cat === "cadete") return d.includes("mirim") || d.includes("cadete");
  return false;
}

function slot(
  weekday: WeekdayKey,
  range: string,
  description: string,
  vagas: number,
): AgendaSlot {
  const id = `${weekday}-${range.replace(/\s/g, "")}`.replace(/–/g, "-");
  return { id, range, description, vagas };
}

/** Grade completa por dia (chave = getDay() em pt: 0=dom … 6=sáb). */
export const AGENDA_BY_WEEKDAY: Record<WeekdayKey, AgendaSlot[]> = {
  segunda: [],
  terca: [
    slot("terca", "08:00 – 09:00", "125cc / F400 (livre)", 4),
    slot("terca", "09:00 – 10:00", "Mirim / Cadete", 5),
    slot("terca", "10:00 – 11:00", "Mirim / Cadete (iniciante)", 5),
    slot("terca", "11:00 – 12:00", "125cc", 4),
    slot("terca", "12:00 – 13:30", "F400", 3),
    slot("terca", "13:30 – 14:30", "Mirim / Cadete", 5),
    slot("terca", "14:30 – 15:20", "125cc / F400 (iniciante)", 4),
    slot("terca", "15:20 – 16:10", "125cc", 4),
    slot("terca", "16:10 – 17:00", "Mirim / Cadete (iniciante)", 5),
  ],
  quarta: [
    slot("quarta", "09:00 – 10:00", "Mirim / Cadete", 5),
    slot("quarta", "10:00 – 11:00", "125cc / F400 (iniciante)", 4),
    slot("quarta", "11:00 – 12:00", "F400", 3),
    slot("quarta", "12:00 – 13:30", "125cc", 4),
    slot("quarta", "13:30 – 14:20", "Mirim / Cadete (iniciante)", 5),
    slot("quarta", "14:20 – 15:10", "125cc / F400 (iniciante)", 4),
    slot("quarta", "15:10 – 16:00", "125cc", 4),
    slot("quarta", "16:00 – 17:00", "Mirim / Cadete", 5),
    slot("quarta", "17:00 – 18:00", "F400", 3),
  ],
  quinta: [
    slot("quinta", "08:00 – 09:00", "125cc / F400 (livre)", 4),
    slot("quinta", "09:00 – 10:00", "Mirim / Cadete", 5),
    slot("quinta", "10:00 – 11:00", "Mirim / Cadete (iniciante)", 5),
    slot("quinta", "11:00 – 12:00", "125cc", 4),
    slot("quinta", "12:00 – 13:30", "F400", 3),
    slot("quinta", "13:30 – 14:30", "Mirim / Cadete", 5),
    slot("quinta", "14:30 – 15:20", "125cc / F400 (iniciante)", 4),
    slot("quinta", "15:20 – 16:10", "125cc", 4),
    slot("quinta", "16:10 – 17:00", "Mirim / Cadete (iniciante)", 5),
  ],
  sexta: [
    slot("sexta", "09:00 – 10:00", "Mirim / Cadete", 5),
    slot("sexta", "10:00 – 11:00", "125cc / F400 (iniciante)", 4),
    slot("sexta", "11:00 – 12:00", "F400", 3),
    slot("sexta", "12:00 – 13:30", "125cc", 4),
    slot("sexta", "13:30 – 14:20", "Mirim / Cadete (iniciante)", 5),
    slot("sexta", "14:20 – 15:10", "125cc / F400 (iniciante)", 4),
    slot("sexta", "15:10 – 16:00", "125cc", 4),
    slot("sexta", "16:00 – 17:00", "Mirim / Cadete", 5),
    slot("sexta", "17:00 – 18:00", "F400", 3),
  ],
  sabado: [
    slot("sabado", "08:00 – 09:30", "125cc", 4),
    slot("sabado", "09:30 – 10:30", "Mirim / Cadete", 6),
    slot("sabado", "10:30 – 11:30", "F400 (campeonato)", 3),
    slot("sabado", "11:30 – 12:30", "F400 (livre)", 3),
    slot("sabado", "12:30 – 13:30", "Mirim / Cadete (iniciante)", 5),
    slot("sabado", "13:30 – 14:20", "125cc", 4),
    slot("sabado", "14:20 – 15:20", "125cc / F400 (iniciante)", 4),
    slot("sabado", "15:20 – 16:20", "Mirim / Cadete", 5),
    slot("sabado", "16:20 – 17:20", "Mirim / Cadete (iniciante)", 5),
    slot("sabado", "17:20 – 18:00", "F400", 3),
  ],
  domingo: [
    slot("domingo", "08:00 – 09:30", "125cc", 4),
    slot("domingo", "09:30 – 11:00", "F400", 3),
    slot("domingo", "11:00 – 12:00", "Mirim / Cadete (iniciante)", 5),
    slot("domingo", "12:00 – 13:00", "Mirim / Cadete", 5),
    slot("domingo", "13:00 – 14:00", "125cc / F400 (iniciante)", 4),
  ],
};
