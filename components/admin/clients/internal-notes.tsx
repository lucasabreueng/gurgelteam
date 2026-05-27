"use client";

import type { ClientProfileDetail } from "@/lib/contracts/clients";

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
  { key: "instructorNotes", label: "Observações do instrutor" },
];

export function InternalNotes({ notes, guardian }: Props) {
  return (
    <div className="space-y-8">
      {guardian ? (
        <section>
          <h3 className="text-lg font-bold text-[#0d1f3c]">Responsável</h3>
          <p className="mt-1 text-sm text-neutral-600">
            Dados do responsável legal (menor de idade).
          </p>
          <dl className="mt-5 grid gap-4 rounded-2xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-5 sm:grid-cols-2">
            <div>
              <dt className="text-[10px] font-bold uppercase text-neutral-500">
                Nome
              </dt>
              <dd className="mt-1 font-semibold text-[#0d1f3c]">
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
                    className="rounded-lg border border-[rgba(17,17,17,0.1)] bg-white px-3 py-1.5 text-[12px] font-medium"
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
        <h3 className="text-lg font-bold text-[#0d1f3c]">
          Observações internas
        </h3>
        <p className="mt-1 text-sm text-neutral-600">
          Visível apenas para a equipe Gurgel Team.
        </p>
        <ul className="mt-5 space-y-3">
          {NOTE_FIELDS.map(({ key, label }) => (
            <li
              key={key}
              className="rounded-xl border border-dashed border-[rgba(17,17,17,0.12)] bg-[#fafbfc]/80 px-4 py-3"
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
