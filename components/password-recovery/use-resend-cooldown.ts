"use client";

import { useCallback, useEffect, useState } from "react";
import { AuthServiceMock } from "@/services/auth/authServiceMock";

export function useResendCooldown() {
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!endsAt) {
      setSecondsLeft(0);
      return;
    }

    const tick = () => {
      const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0) setEndsAt(null);
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  const startCooldown = useCallback(() => {
    setEndsAt(
      Date.now() + AuthServiceMock.getRecoveryResendCooldownSeconds() * 1000,
    );
  }, []);

  const canResend = secondsLeft <= 0;

  return { secondsLeft, canResend, startCooldown };
}
