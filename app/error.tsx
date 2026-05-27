"use client";

import { useEffect } from "react";
import { ErrorPage } from "@/components/errors/error-page";
import { ERROR_PAGES } from "@/lib/error-pages";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorPage
      config={ERROR_PAGES["500"]}
      pageKey="500"
      onRetry={reset}
    />
  );
}
