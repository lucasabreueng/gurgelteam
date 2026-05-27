import {
  HiClipboardDocumentCheck,
  HiCube,
  HiPlus,
  HiWrench,
} from "react-icons/hi2";
import { AdminPageHeader } from "../admin-page-header";

type Props = {
  onOpenChecklist: () => void;
  onRegisterPart: () => void;
  onNewInspection: () => void;
  onNewMaintenance: () => void;
};

export function MaintenanceHeader({
  onOpenChecklist,
  onRegisterPart,
  onNewInspection,
  onNewMaintenance,
}: Props) {
  return (
    <AdminPageHeader
      title="Manutenção"
      subtitle="Gerencie ordens de serviço, preventivas, revisões e liberação técnica dos karts."
      actions={
        <>
          <button type="button" onClick={onOpenChecklist} className="btn-outline-md">
            <HiClipboardDocumentCheck className="h-4 w-4" aria-hidden />
            Abrir checklist
          </button>
          <button type="button" onClick={onRegisterPart} className="btn-outline-md">
            <HiCube className="h-4 w-4" aria-hidden />
            Registrar peça
          </button>
          <button type="button" onClick={onNewInspection} className="btn-outline-md">
            <HiWrench className="h-4 w-4" aria-hidden />
            Nova inspeção
          </button>
          <button type="button" onClick={onNewMaintenance} className="btn-primary-md">
            <HiPlus className="h-4 w-4" aria-hidden />
            Nova manutenção
          </button>
        </>
      }
    />
  );
}
