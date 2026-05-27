import {
  HiArrowDownTray,
  HiBanknotes,
  HiPlus,
} from "react-icons/hi2";
import { AdminPageHeader } from "../admin-page-header";

type Props = {
  title: string;
  subtitle: string;
  onNewCharge?: () => void;
  onNewExpense?: () => void;
  onRegisterPayment?: () => void;
  onExport?: () => void;
};

export function FinancialHeader({
  title,
  subtitle,
  onNewCharge,
  onNewExpense,
  onRegisterPayment,
  onExport,
}: Props) {
  return (
    <AdminPageHeader
      title={title}
      subtitle={subtitle}
      actions={
        <>
          <button type="button" onClick={onNewCharge} className="btn-outline-sm bg-white">
            <HiPlus className="h-4 w-4" aria-hidden />
            Nova cobrança
          </button>
          <button type="button" onClick={onNewExpense} className="btn-outline-sm bg-white">
            <HiPlus className="h-4 w-4" aria-hidden />
            Nova despesa
          </button>
          <button type="button" onClick={onRegisterPayment} className="btn-primary-sm">
            <HiBanknotes className="h-4 w-4" aria-hidden />
            Registrar pagamento
          </button>
          <button type="button" onClick={onExport} className="btn-outline-sm bg-white">
            <HiArrowDownTray className="h-4 w-4" aria-hidden />
            Exportar relatório
          </button>
        </>
      }
    />
  );
}
