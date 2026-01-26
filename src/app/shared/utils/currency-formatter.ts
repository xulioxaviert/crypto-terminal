/**
 * Formats a numeric value into a human-readable string with K, M, B, or T suffixes.
 * @param value - The numeric value to format
 * @returns A formatted string with the appropriate suffix (T for trillion, B for billion, M for million, or the original value if less than 1 million)
 * @example
 * formatKMB(1500000) // Returns "1.50M"
 * formatKMB(2500000000) // Returns "2.50B"
 * formatKMB(3500000000000) // Returns "3.50T"
 * formatKMB(500) // Returns "500"
 */
export function formatKMB(value: number): string {
  if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T';
  if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
  if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
  return value.toString();
}

/**
 * Formats large numbers with currency symbol and K, M, B, or T suffixes.
 * Used for displaying Market Cap, Volume, and other large financial values.
 * @param value - The numeric value to format
 * @returns A formatted string with $ prefix and appropriate suffix
 * @example
 * formatLargeNumber(1500000000000) // Returns "$1.50T"
 * formatLargeNumber(2500000000) // Returns "$2.50B"
 * formatLargeNumber(3500000) // Returns "$3.50M"
 * formatLargeNumber(500.25) // Returns "$500.25"
 */
export function formatLargeNumber(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toFixed(2)}`;
}
