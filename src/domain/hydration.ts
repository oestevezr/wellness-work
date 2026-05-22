import type { HydrationEntry } from "../types/models";

export const QUICK_ADD_CUP_SIZES = [150, 250, 350, 500] as const;

export function defaultHydrationGoalFromWeight(weightKg: number): number {
  return Math.max(1000, Math.round(weightKg * 35));
}

export function hydrationTotal(entries: HydrationEntry[]): number {
  return entries.reduce((total, entry) => total + entry.amountML, 0);
}
