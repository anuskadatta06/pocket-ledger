export const DEFAULT_PALETTE = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Rose
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#64748B", // Slate
];

export function getConsistentCategoryColor(index: number, customColor?: string): string {
  if (customColor && customColor.startsWith("#")) {
    return customColor;
  }
  return DEFAULT_PALETTE[index % DEFAULT_PALETTE.length];
}
