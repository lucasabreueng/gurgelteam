type Props = {
  message?: string;
  messages?: string[];
};

export function FieldError({ message, messages }: Props) {
  const items = messages?.length ? messages : message ? [message] : [];
  if (!items.length) return null;

  return (
    <div className="mt-1.5 space-y-0.5">
      {items.map((text) => (
        <p key={text} className="text-[12px] font-medium leading-snug text-[#c41e3a]">
          {text}
        </p>
      ))}
    </div>
  );
}
