"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HiOutlineBell } from "react-icons/hi2";
import { useAdminInboxNotifications } from "@/lib/query/hooks/use-admin-inbox-notifications";

const btnClass =
  "relative flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(17,17,17,0.08)] bg-white text-[#0d1f3c] transition hover:border-accent/25";

export function HeaderNotificationsMenu() {
  const { data: notifications = [], isPending } = useAdminInboxNotifications();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.length;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={btnClass}
        aria-label="Notificações"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <HiOutlineBell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span
            className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-[#c41e3a]"
            aria-hidden
          />
        ) : null}
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Notificações não lidas"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[100] w-[min(calc(100vw-2rem),360px)] overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.1)] bg-white shadow-[0_12px_40px_rgba(13,31,60,0.15)]"
        >
          <div className="border-b border-[rgba(17,17,17,0.08)] px-4 py-3">
            <p className="text-sm font-bold text-[#0d1f3c]">Notificações</p>
            <p className="text-[11px] text-neutral-500">
              {isPending
                ? "Carregando…"
                : unreadCount === 0
                  ? "Nenhuma não lida"
                  : `${unreadCount} não lida${unreadCount === 1 ? "" : "s"}`}
            </p>
          </div>

          <ul className="max-h-80 overflow-y-auto py-1">
            {isPending ? (
              <li className="px-4 py-6 text-center text-sm text-neutral-500">
                Carregando notificações…
              </li>
            ) : notifications.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-neutral-500">
                Você está em dia. Nenhuma notificação pendente.
              </li>
            ) : (
              notifications.map((item) => {
                const row = (
                  <>
                    <p className="text-sm font-semibold text-[#0d1f3c]">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-snug text-neutral-600">
                      {item.message}
                    </p>
                    <p className="mt-1.5 text-[11px] font-medium text-neutral-400">
                      {item.createdAtLabel}
                    </p>
                  </>
                );

                return (
                  <li key={item.id} className="border-b border-[rgba(17,17,17,0.05)] last:border-0">
                    {item.href ? (
                      <Link
                        role="menuitem"
                        href={item.href}
                        className="block px-4 py-3 transition hover:bg-[rgba(13,31,60,0.04)]"
                        onClick={() => setOpen(false)}
                      >
                        {row}
                      </Link>
                    ) : (
                      <div role="menuitem" className="px-4 py-3">
                        {row}
                      </div>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
