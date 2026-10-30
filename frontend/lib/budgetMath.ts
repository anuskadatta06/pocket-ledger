export function clampPercentage(value: number, max = 100): number {
  if (value < 0) return 0;
  if (value > max) return max;
  return Math.round(value);
}

export function isBudgetExceeded(spent: number, limit: number): boolean {
  return spent > limit;
}
