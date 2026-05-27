import Image from "next/image";
import { NewClassServiceMock } from "@/services/schedule/newClassServiceMock";

export function GurgelOperationalCard() {
  const instructor = NewClassServiceMock.getInstructor();
  return (
    <section className="overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.08)] bg-gradient-to-br from-[#0d1f3c] via-[#152a47] to-[#0d1f3c] text-white shadow-[0_8px_28px_rgba(13,31,60,0.2)]">
      <div className="flex gap-4 p-4 md:p-5">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/20">
          <Image
            src={instructor.avatar}
            alt={instructor.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
            Instrutor responsável
          </p>
          <h2 className="text-2xl font-black tracking-tight">
            {instructor.name}
          </h2>
          <p className="mt-1 text-sm text-white/75">
            {instructor.specialty}
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg bg-white/10 px-3 py-2 ring-1 ring-white/10">
              <dt className="text-white/45">Ocupação do dia</dt>
              <dd className="mt-0.5 text-lg font-bold tabular-nums">
                {instructor.dayOccupancy}%
              </dd>
            </div>
            <div className="rounded-lg bg-white/10 px-3 py-2 ring-1 ring-white/10">
              <dt className="text-white/45">Status</dt>
              <dd className="mt-0.5 font-bold">
                {instructor.operationalStatusLabel}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="border-t border-white/10 bg-white/5 px-4 py-3 md:px-5">
        <p className="text-[10px] font-bold uppercase text-white/45">
          Próximas aulas
        </p>
        <ul className="mt-1 flex flex-wrap gap-2">
          {instructor.nextClasses.map((c) => (
            <li
              key={c}
              className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold"
            >
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
