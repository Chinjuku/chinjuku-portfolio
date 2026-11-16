/** Splits a non-negative integer into its decimal digits (0 -> [0]). */
export const odometerDigits = (value: number): number[] =>
  String(Math.max(0, Math.floor(value)))
    .split("")
    .map(Number);
