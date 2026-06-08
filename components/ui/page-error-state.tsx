"use client";

import { HiArrowPath, HiExclamationTriangle } from "react-icons/hi2";

type PageErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export function PageErrorState({
  title = "Não foi possível carregar",
  message = "Verifique sua conexão e tente novamente.",
  onRetry,
  className = "",
}: PageErrorStateProps) {
  const handleRetry = () => {
    if (onRetry) onRetry();
    else window.location.reload();
  };

  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center rounded-2xl border border-red-200/60 bg-red-50/80 px-6 py-12 text-center ${className}`}
    >
      <HiExclamationTriangle className="h-10 w-10 text-red-600" aria-hidden />
      <h2 className="mt-4 text-lg font-bold text-[#0d1f3c]">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-neutral-600">{message}</p>
      <button
        type="button"
        onClick={handleRetry}
        className="btn-outline-sm mt-6 inline-flex items-center gap-2 bg-white"
      >
        <HiArrowPath className="h-4 w-4" aria-hidden />
        Tentar novamente
      </button>
    </div>
  );
}
