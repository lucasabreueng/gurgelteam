import { FinancialReportsSection } from "../financial-reports-section";

type Props = {
  onAction: (msg: string) => void;
};

export function FinancialReportsTab({ onAction }: Props) {
  return (
    <div className="admin-page-stack">
      <FinancialReportsSection onAction={onAction} />
    </div>
  );
}

