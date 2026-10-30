export interface ChartPoint {
  label: string;
  value: number;
  color?: string;
}

export function calculateBarHeights(data: number[], maxPixels = 160): number[] {
  const maxVal = Math.max(...data, 1);
  return data.map((v) => Math.max(4, Math.round((v / maxVal) * maxPixels)));
}

export function formatChartCurrency(val: number): string {
  if (val >= 1000) {
    return `$${(val / 1000).toFixed(1)}k`;
  }
  return `$${val.toFixed(0)}`;
}
