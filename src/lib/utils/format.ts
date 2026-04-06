/**
 * Format a number with commas (for NIS amounts, etc.)
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("he-IL").format(num);
}

/**
 * Format NIS currency
 */
export function formatCurrency(amount: number): string {
  return `${formatNumber(amount)} ₪`;
}

/**
 * Get ordinal suffix for rank in Hebrew
 */
export function formatRank(rank: number): string {
  if (rank === 0) return "-";
  return `#${rank}`;
}

/**
 * Get rank change display
 */
export function formatRankChange(change: number): {
  text: string;
  className: string;
} {
  if (change === 0) return { text: "-", className: "text-muted-foreground" };
  if (change > 0)
    return { text: `↑${change}`, className: "text-green-600" };
  return { text: `↓${Math.abs(change)}`, className: "text-red-600" };
}

/**
 * Score display (LTR within RTL context)
 */
export function formatScore(home: number | null, away: number | null): string {
  if (home === null || away === null) return "- : -";
  return `${home} : ${away}`;
}

/**
 * Prediction count display
 */
export function formatPredictionProgress(predicted: number, total: number): string {
  return `${predicted}/${total}`;
}
