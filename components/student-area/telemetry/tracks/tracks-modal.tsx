"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { HiOutlineCog6Tooth, HiTrash } from "react-icons/hi2";
import { AppModal } from "@/components/ui/app-modal";
import type { GpsLine } from "@/lib/telemetry-engine";
import {
  createTrackId,
  defaultLinesDraft,
  linesDraftToStrings,
  parseCoord,
  stringsToLinesDraft,
  userTrackToEngineTrack,
  type LinesInputStrings,
  type UserTrackRecord,
} from "@/lib/telemetry-engine/tracks/user-track-types";
import {
  deleteUserTrack,
  listUserTracks,
  saveUserTrack,
} from "@/lib/telemetry-engine/tracks/user-track-store";
import { TelemetryGoogleMap } from "../telemetry-google-map";

type Props = {
  open: boolean;
  onClose: () => void;
  onChanged?: () => void;
};

type Step = "list" | "info" | "lines";

const btnSecondary =
  "rounded-xl border border-[rgba(17,17,17,0.12)] px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50";

const btnPrimary =
  "rounded-xl bg-accent px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white transition hover:brightness-110 disabled:opacity-50";

const btnPrimaryFull =
  "w-full rounded-xl bg-accent py-3 text-[12px] font-bold uppercase tracking-wider text-white transition hover:brightness-110 disabled:opacity-50";

const iconBtnBase =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition disabled:opacity-50";

const iconBtnNeutral = `${iconBtnBase} border border-[rgba(17,17,17,0.12)] text-neutral-600 hover:bg-neutral-50`;

const iconBtnDanger = `${iconBtnBase} border border-red-200 text-red-600 hover:bg-red-50`;

const inputClass =
  "mt-1 w-full rounded-lg border border-[rgba(17,17,17,0.12)] bg-white px-3 py-2 text-[13px] text-[#0d1f3c]";

export function TracksModal({ open, onClose, onChanged }: Props) {
  const [step, setStep] = useState<Step>("list");
  const [tracks, setTracks] = useState<UserTrackRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [lineInputs, setLineInputs] = useState<LinesInputStrings>(
    linesDraftToStrings(defaultLinesDraft(-15.8254576, -47.9743033)),
  );

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await listUserTracks();
      setTracks(rows);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setStep("list");
    setError(null);
    setEditingId(null);
    void reload();
  }, [open, reload]);

  const parsedLines = useMemo(() => stringsToLinesDraft(lineInputs), [lineInputs]);

  const previewTrack = useMemo(() => {
    const lat = parseCoord(latitude);
    const lon = parseCoord(longitude);
    if (lat == null || lon == null || !parsedLines) return null;
    const draft: UserTrackRecord = {
      id: editingId ?? "preview",
      name: name || "Pista",
      city: city || "",
      center: { latitude: lat, longitude: lon },
      map: { kind: "google" },
      lines: parsedLines,
      length: 890,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return userTrackToEngineTrack(draft);
  }, [name, city, latitude, longitude, parsedLines, editingId]);

  const mapLines = previewTrack
    ? [
        { id: "s1", line: previewTrack.startFinishLine, color: "#fbbf24", dashed: true },
        { id: "s2", line: previewTrack.sectors[0].endLine, color: "#60a5fa", dashed: false },
        { id: "s3", line: previewTrack.sectors[1].endLine, color: "#a78bfa", dashed: false },
      ]
    : [];

  const resetForm = (lat: number, lon: number) => {
    setName("");
    setCity("");
    setLatitude(String(lat));
    setLongitude(String(lon));
    setLineInputs(linesDraftToStrings(defaultLinesDraft(lat, lon)));
  };

  const startCreate = () => {
    setEditingId(null);
    resetForm(-15.8254576, -47.9743033);
    setStep("info");
  };

  const startEdit = (track: UserTrackRecord) => {
    setEditingId(track.id);
    setName(track.name);
    setCity(track.city);
    setLatitude(String(track.center.latitude));
    setLongitude(String(track.center.longitude));
    setLineInputs(linesDraftToStrings(track.lines));
    setStep("lines");
  };

  const goToLines = () => {
    if (!name.trim()) {
      setError("Informe o nome da pista.");
      return;
    }
    if (!city.trim()) {
      setError("Informe a cidade.");
      return;
    }
    const lat = parseCoord(latitude);
    const lon = parseCoord(longitude);
    if (lat == null || lon == null) {
      setError("Latitude e longitude inválidas.");
      return;
    }
    setError(null);
    if (!editingId) {
      setLineInputs(linesDraftToStrings(defaultLinesDraft(lat, lon)));
    }
    setStep("lines");
  };

  const updateLineField = (
    key: keyof LinesInputStrings,
    field: keyof GpsLine,
    value: string,
  ) => {
    setLineInputs((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const handleSave = async () => {
    const lines = stringsToLinesDraft(lineInputs);
    if (!name.trim() || !city.trim()) {
      setError("Preencha nome, cidade e coordenadas.");
      return;
    }
    if (!lines) {
      setError("Verifique os pontos GPS das linhas S1, S2 e S3.");
      return;
    }

    const lat = parseCoord(latitude);
    const lon = parseCoord(longitude);
    if (lat == null || lon == null) {
      setError("Latitude e longitude inválidas.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const now = new Date().toISOString();
      const existing = editingId ? tracks.find((t) => t.id === editingId) : null;
      const record: UserTrackRecord = {
        id: editingId ?? createTrackId(),
        name: name.trim(),
        city: city.trim(),
        center: { latitude: lat, longitude: lon },
        map: { kind: "google" },
        lines,
        length: existing?.length ?? 890,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };
      await saveUserTrack(record);
      onChanged?.();
      await reload();
      setStep("list");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao salvar pista.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Excluir esta pista?")) return;
    setLoading(true);
    try {
      await deleteUserTrack(id);
      onChanged?.();
      await reload();
    } finally {
      setLoading(false);
    }
  };

  const title =
    step === "list"
      ? "Pistas"
      : step === "info"
        ? "Cadastrar pista"
        : "Linhas de setor (S1 · S2 · S3)";

  const description =
    step === "list"
      ? "Cadastre pistas e configure o GPS no Google Maps."
      : step === "info"
        ? "Informe nome, cidade e coordenadas de referência da pista."
        : "S1 = largada/chegada. S2 e S3 definem os setores.";

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      maxWidth="2xl"
      preventClose={loading}
      footer={
        step === "list" ? (
          <button
            type="button"
            onClick={startCreate}
            disabled={loading}
            className={btnPrimaryFull}
          >
            Nova pista
          </button>
        ) : undefined
      }
    >
      {step === "list" && (
        <div className="space-y-4">
          <ListContent
            tracks={tracks}
            loading={loading}
            onEdit={startEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      {step === "info" && (
        <div className="space-y-4">
          <Field label="Nome da pista" value={name} onChange={setName} placeholder="Kartódromo Ayrton Senna" />
          <Field label="Cidade" value={city} onChange={setCity} placeholder="Brasília" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Latitude" value={latitude} onChange={setLatitude} placeholder="-15.82545" />
            <Field label="Longitude" value={longitude} onChange={setLongitude} placeholder="-47.97430" />
          </div>
          <p className="text-[12px] text-neutral-500">
            Use o Google Maps (satélite) no próximo passo para conferir o traçado e as linhas de setor.
          </p>
          {error ? <p className="text-[12px] font-medium text-red-600">{error}</p> : null}
          <div className="flex gap-2 pt-2">
            <button type="button" className={btnSecondary} onClick={() => setStep("list")}>
              Voltar
            </button>
            <button type="button" className={btnPrimary} onClick={goToLines}>
              Continuar → linhas
            </button>
          </div>
        </div>
      )}

      {step === "lines" && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nome" value={name} onChange={setName} />
            <Field label="Cidade" value={city} onChange={setCity} />
            <Field label="Latitude (ref.)" value={latitude} onChange={setLatitude} />
            <Field label="Longitude (ref.)" value={longitude} onChange={setLongitude} />
          </div>

          <LineEditor
            title="S1 — Largada / chegada (início de volta)"
            line={lineInputs.s1}
            onChange={(f, v) => updateLineField("s1", f, v)}
            accent="border-amber-300 bg-amber-50/50"
          />
          <LineEditor
            title="S2 — Fim do setor 1"
            line={lineInputs.s2}
            onChange={(f, v) => updateLineField("s2", f, v)}
            accent="border-blue-200 bg-blue-50/40"
          />
          <LineEditor
            title="S3 — Fim do setor 2"
            line={lineInputs.s3}
            onChange={(f, v) => updateLineField("s3", f, v)}
            accent="border-violet-200 bg-violet-50/40"
          />

          {previewTrack ? (
            <TelemetryGoogleMap
              center={{
                lat: previewTrack.center.latitude,
                lng: previewTrack.center.longitude,
              }}
              lines={mapLines}
              height={280}
              mapType="satellite"
            />
          ) : (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-[12px] text-amber-900">
              Preencha coordenadas válidas para visualizar o mapa.
            </p>
          )}

          <TrackLegend />

          {error ? <p className="text-[12px] font-medium text-red-600">{error}</p> : null}

          <div className="flex flex-wrap gap-2 pt-2">
            <button type="button" className={btnSecondary} disabled={loading} onClick={() => setStep("list")}>
              Voltar
            </button>
            <button type="button" className={btnPrimary} disabled={loading} onClick={() => void handleSave()}>
              {loading ? "Salvando…" : "Salvar pista"}
            </button>
          </div>
        </div>
      )}
    </AppModal>
  );
}

function ListContent({
  tracks,
  loading,
  onEdit,
  onDelete,
}: {
  tracks: UserTrackRecord[];
  loading: boolean;
  onEdit: (t: UserTrackRecord) => void;
  onDelete: (id: string) => void;
}) {
  if (loading && tracks.length === 0) {
    return <p className="text-[13px] text-neutral-500">Carregando…</p>;
  }

  if (tracks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[rgba(17,17,17,0.15)] bg-neutral-50/80 px-6 py-10 text-center">
        <p className="text-[14px] font-semibold text-[#0d1f3c]">Nenhuma pista cadastrada</p>
        <p className="mt-2 text-[12px] text-neutral-600">
          Cadastre a pista com nome, cidade e coordenadas. Depois configure as linhas S1, S2 e S3 no mapa.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {tracks.map((t) => (
        <li
          key={t.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-[rgba(17,17,17,0.08)] bg-neutral-50/80 px-4 py-3"
        >
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[#0d1f3c]">{t.name}</p>
            <p className="truncate text-[12px] text-neutral-600">
              {t.city} · {t.center.latitude.toFixed(5)}, {t.center.longitude.toFixed(5)}
            </p>
          </div>
          <div className="flex shrink-0 gap-1.5">
            <button
              type="button"
              aria-label={`Configurar ${t.name}`}
              title="Configurar"
              onClick={() => onEdit(t)}
              className={iconBtnNeutral}
            >
              <HiOutlineCog6Tooth className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              aria-label={`Excluir ${t.name}`}
              title="Excluir"
              onClick={() => void onDelete(t.id)}
              className={iconBtnDanger}
            >
              <HiTrash className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

function LineEditor({
  title,
  line,
  onChange,
  accent,
}: {
  title: string;
  line: { latA: string; lonA: string; latB: string; lonB: string };
  onChange: (field: keyof GpsLine, value: string) => void;
  accent: string;
}) {
  return (
    <fieldset className={`rounded-xl border px-3 py-3 ${accent}`}>
      <legend className="px-1 text-[12px] font-bold text-[#0d1f3c]">{title}</legend>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MiniField label="Lat A" value={line.latA} onChange={(v) => onChange("latA", v)} />
        <MiniField label="Lon A" value={line.lonA} onChange={(v) => onChange("lonA", v)} />
        <MiniField label="Lat B" value={line.latB} onChange={(v) => onChange("latB", v)} />
        <MiniField label="Lon B" value={line.lonB} onChange={(v) => onChange("lonB", v)} />
      </div>
    </fieldset>
  );
}

function MiniField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold text-neutral-600">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-0.5 w-full rounded-md border border-[rgba(17,17,17,0.1)] bg-white px-2 py-1.5 font-mono text-[12px]"
      />
    </label>
  );
}

function TrackLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-[11px] text-neutral-600">
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-amber-400" />
        S1 — largada/chegada
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-0.5 w-4 bg-blue-400" />
        S2
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-0.5 w-4 bg-violet-400" />
        S3
      </span>
    </div>
  );
}
