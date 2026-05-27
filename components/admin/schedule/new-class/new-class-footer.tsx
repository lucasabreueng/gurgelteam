type Props = {
  onConfirm: () => void;
  confirmDisabled?: boolean;
};

export function NewClassFooter({ onConfirm, confirmDisabled }: Props) {
  return (
    <footer className="shrink-0 border-t border-[rgba(17,17,17,0.08)] bg-white px-4 py-3 md:px-5">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onConfirm}
          disabled={confirmDisabled}
          className="w-full rounded-xl bg-[#0d1f3c] px-5 py-3 text-[10px] font-bold uppercase text-white shadow-md disabled:opacity-50 sm:w-auto sm:min-w-[200px]"
        >
          Agendar aula
        </button>
      </div>
    </footer>
  );
}
