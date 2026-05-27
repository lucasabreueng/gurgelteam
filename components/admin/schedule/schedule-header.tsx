import { HiLockClosed, HiPlus } from "react-icons/hi2";
import { AdminPageHeader } from "../admin-page-header";

type Props = {
  onNewClass: () => void;
  onBlockSlot: () => void;
};

export function ScheduleHeader({ onNewClass, onBlockSlot }: Props) {
  return (
    <AdminPageHeader
      title="Agenda"
      subtitle="Gerencie aulas, treinos, reservas, disponibilidade e operação diária."
      actions={
        <>
          <button type="button" onClick={() => onNewClass()} className="btn-outline-sm">
            <HiPlus className="h-4 w-4" aria-hidden />
            Nova aula
          </button>
          <button type="button" onClick={onBlockSlot} className="btn-outline-sm">
            <HiLockClosed className="h-4 w-4" aria-hidden />
            Bloquear horário
          </button>
        </>
      }
    />
  );
}
