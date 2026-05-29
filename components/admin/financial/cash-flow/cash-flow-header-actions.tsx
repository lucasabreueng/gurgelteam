"use client";

import {
  HiArrowDownTray,
  HiArrowUpTray,
  HiPlus,
} from "react-icons/hi2";

type Props = {
  onNewEntry: () => void;
  onNewExit: () => void;
  onImport: () => void;
  onExport: () => void;
};

export function CashFlowHeaderActions({
  onNewEntry,
  onNewExit,
  onImport,
  onExport,
}: Props) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <button type="button" onClick={onNewEntry} className="btn-primary-sm">
        <HiPlus className="h-4 w-4" aria-hidden />
        Nova entrada
      </button>
      <button type="button" onClick={onNewExit} className="btn-outline-sm bg-white">
        <HiPlus className="h-4 w-4" aria-hidden />
        Nova saída
      </button>
      <button type="button" onClick={onImport} className="btn-outline-sm bg-white">
        <HiArrowUpTray className="h-4 w-4" aria-hidden />
        Importar extrato
      </button>
      <button type="button" onClick={onExport} className="btn-outline-sm bg-white">
        <HiArrowDownTray className="h-4 w-4" aria-hidden />
        Exportar relatório
      </button>
    </div>
  );
}
