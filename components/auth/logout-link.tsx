"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { logoutClient } from "@/lib/auth/logout-client";

type LogoutLinkProps = {
  href?: string;
  children: ReactNode;
  onClick?: () => void;
} & Omit<ComponentProps<typeof Link>, "href" | "onClick" | "children">;

export function LogoutLink({
  href = "/",
  className,
  children,
  onClick,
  ...rest
}: LogoutLinkProps) {
  const router = useRouter();

  const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onClick?.();
    await logoutClient();
    router.push(href);
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
