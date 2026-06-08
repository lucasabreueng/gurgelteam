"use client";

import type {
  BusinessEvolutionPeriod,
  ExecutiveAlert,
} from "@/lib/admin-financial-mocks";
import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";

export function useMonthlyRevenueChart() {
  return useQuery({
    queryKey: [...queryKeys.finance.all, "monthly-revenue-chart"] as const,
    queryFn: () => getAppServices().finance.getMonthlyRevenueChart(),
  });
}

export function useSmartInsights() {
  return useQuery({
    queryKey: [...queryKeys.finance.all, "smart-insights"] as const,
    queryFn: () => getAppServices().finance.getSmartInsights(),
  });
}

export function useExecutiveAlerts() {
  return useQuery<ExecutiveAlert[]>({
    queryKey: [...queryKeys.finance.all, "executive-alerts"] as const,
    queryFn: () => getAppServices().finance.getExecutiveAlerts(),
  });
}

export function useInOutChart() {
  return useQuery({
    queryKey: [...queryKeys.finance.all, "in-out-chart"] as const,
    queryFn: () => getAppServices().finance.getInOutChart(),
  });
}

export function useRevenueByService() {
  return useQuery({
    queryKey: [...queryKeys.finance.all, "revenue-by-service"] as const,
    queryFn: () => getAppServices().finance.getRevenueByService(),
  });
}

export function useRevenueOrigin() {
  return useQuery({
    queryKey: [...queryKeys.finance.all, "revenue-origin"] as const,
    queryFn: () => getAppServices().finance.getRevenueOrigin(),
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: [...queryKeys.finance.all, "payment-methods"] as const,
    queryFn: () => getAppServices().finance.getPaymentMethods(),
  });
}

export function useBusinessEvolution(period: BusinessEvolutionPeriod) {
  return useQuery({
    queryKey: [...queryKeys.finance.all, "business-evolution", period] as const,
    queryFn: async () => {
      const all = await getAppServices().finance.getBusinessEvolution();
      return all[period];
    },
  });
}

export function useFinancialEvolutionChart() {
  return useQuery({
    queryKey: [...queryKeys.finance.all, "financial-evolution"] as const,
    queryFn: () => getAppServices().finance.getFinancialEvolution(),
  });
}

export function useUpcomingPayables() {
  return useQuery({
    queryKey: [...queryKeys.finance.all, "upcoming-payables"] as const,
    queryFn: () => getAppServices().finance.getUpcomingPayables(),
  });
}
