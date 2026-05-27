import { HiExclamationTriangle } from "react-icons/hi2";

type Props = {
  message: string;
  tone: "low" | "critical" | "error";
};

const styles = {
  low: "border-amber-200/60 bg-amber-50 text-amber-950",
  critical: "border-orange-200/60 bg-orange-50 text-orange-950",
  error: "border-red-200/60 bg-red-50 text-red-950",
};

export function StockAlert({ message, tone }: Props) {
  return (
    <div
      role="alert"
      className={`flex gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium ${styles[tone]}`}
    >
      <HiExclamationTriangle className="mt-0.5 h-5 w-5 shrink-0" />
      {message}
    </div>
  );
}
