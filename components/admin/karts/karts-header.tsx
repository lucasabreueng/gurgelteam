import { HiPlus } from "react-icons/hi2";
import { AdminPageHeader } from "../admin-page-header";

type Props = {
  onNewKart?: () => void;
};

export function KartsHeader({ onNewKart }: Props) {
  return (
    <AdminPageHeader
      title="Karts"
      subtitle="Gerencie disponibilidade, manutenção, desempenho e histórico dos karts."
      actions={
        <button type="button" onClick={onNewKart} className="btn-primary-md">
          <HiPlus className="h-4 w-4" aria-hidden />
          Novo kart
        </button>
      }
    />
  );
}
