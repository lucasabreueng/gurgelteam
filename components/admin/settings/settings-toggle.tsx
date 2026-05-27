"use client";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
};

export function SettingsToggle({
  checked,
  onChange,
  label,
  id,
  disabled,
}: Props) {
  const toggleId = id ?? label?.replace(/\s/g, "-").toLowerCase();

  return (
    <label
      htmlFor={toggleId}
      className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl px-1 py-2 ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      {label ? (
        <span className="text-[14px] font-medium text-neutral-700">{label}</span>
      ) : null}
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked ? "bg-accent" : "bg-neutral-200"
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}

/** Alias para notificações */
export function NotificationToggle(props: Props) {
  return <SettingsToggle {...props} />;
}
