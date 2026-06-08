"use client";

import type { ClientProfileDetail } from "@/lib/contracts/clients";
import {
  adminCardMutedClass,
  adminNoteDashedClass,
  adminOutlineButtonClass,
  adminSubsectionTitleClass,
  adminTextAccentClass,
} from "@/lib/design";

type Props = {
  notes: ClientProfileDetail["internalNotes"];
  guardian?: ClientProfileDetail["guardian"];
};

const NOTE_FIELDS: {
  key: keyof ClientProfileDetail["internalNotes"];
  label: string;
}[] = [
  { key: "behavior", label: "Comportamento" },
  { key: "emotional", label: "Perfil emocional" },
  { key: "competitive", label: "Potencial competitivo" },
  { key: "difficulties", label: "Dificuldades" },
  { key: "technicalNotes", label: "Observações técnicas" },
];

export function InternalNotes({ notes, guardian }: Props) {
  return (
    <div className="space-y-8">
      {guardian ? (
        <section>
          <h3 className={adminSubsectionTitleClass}>Responsável</h3>
          <p className="mt-1 text-sm text-neutral-600">
            Dados do responsável legal (menor de idade).
          </p>
          <dl className={`mt-5 grid gap-4 sm:grid-cols-2 ${adminCardMutedClass}`}>
            <div>
              <dt className="text-[10px] font-bold uppercase text-neutral-500">
                Nome
              </dt>
              <dd className={`mt-1 ${adminTextAccentClass}`}>
                {guardian.name}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase text-neutral-500">
                Telefone
              </dt>
              <dd className="mt-1 font-semibold">{guardian.phone}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase text-neutral-500">
                E-mail
              </dt>
              <dd className="mt-1 font-semibold">{guardian.email}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase text-neutral-500">
                Autorização
              </dt>
              <dd className="mt-1 text-sm">{guardian.authorization}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[10px] font-bold uppercase text-neutral-500">
                Documentos
              </dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {guardian.documents.map((doc) => (
                  <span
                    key={doc}
                    className={`rounded-lg px-3 py-1.5 text-[12px] font-medium ${adminOutlineButtonClass}`}
                  >
                    {doc}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </section>
      ) : null}

      <section>
        <h3 className={adminSubsectionTitleClass}>
          Observações internas
        </h3>
        <p className="mt-1 text-sm text-neutral-600">
          Visível apenas para a equipe Gurgel Team.
        </p>
        <ul className="mt-5 space-y-3">
          {NOTE_FIELDS.map(({ key, label }) => (
            <li
              key={key}
              className={adminNoteDashedClass}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                {label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                {notes[key]}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
