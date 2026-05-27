"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(false), 500);
    return () => window.clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-accent-gradient-soft transition-opacity duration-500"
      aria-hidden
    >
      <div className="relative mx-auto my-10 h-[100px] w-[100px] rounded-full">
        <div className="loading-ring absolute inset-0 rounded-full border-2 border-transparent border-t-white border-b-white animate-spin-slow" />
        <div className="absolute left-1/2 top-1/2 max-w-[66px] -translate-x-1/2 -translate-y-1/2">
          <Image src="/images/loader.svg" alt="" width={66} height={66} />
        </div>
      </div>
    </div>
  );
}
