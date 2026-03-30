export function formatCurrencyNumber(value: number, locale = "en-IN", currency = "INR") {
  const hasDecimals = Math.abs(value % 1) > 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(value);
}

/**
 * Accepts a raw price string like "$160/night" or a number and returns
 * a formatted INR currency string like "₹160" (no unit suffix).
 */
export function formatPriceString(raw?: string | number | null): string {
  if (raw === undefined || raw === null) return "";
  if (typeof raw === "number") return formatCurrencyNumber(raw);

  const s = String(raw).trim();
  // match first numeric token, allow thousands separators and decimals
  const m = s.match(/-?[\d,]+(?:\.\d+)?/);
  if (m) {
    const num = parseFloat(m[0].replace(/,/g, ""));
    if (isNaN(num)) return s.replace(/^[\s]*[$€£]/, "₹");
    return formatCurrencyNumber(num);
  }

  // fallback: replace common leading currency symbols with rupee symbol
  return s.replace(/^[\s]*[$€£]/, "₹");
}

export default formatPriceString;
