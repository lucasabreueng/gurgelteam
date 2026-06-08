"use client";

import { useQuery } from "@tanstack/react-query";

import {
  loadKartChassisTerms,
  loadKartMotorTerms,
} from "@/lib/karts/kart-terms";
import { queryKeys } from "@/lib/query/keys";

export function useKartTerms() {
  return useQuery({
    queryKey: queryKeys.karts.terms(),
    queryFn: async () => ({
      motors: await loadKartMotorTerms(),
      chassis: await loadKartChassisTerms(),
    }),
  });
}
