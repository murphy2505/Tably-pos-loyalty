/**
 * Converteer willekeurige invoer naar een Decimal-compatibele string.
 * - Ondersteunt komma-naar-punt conversie (NL).
 * - Gooi errors bij null/undefined/lege string/niet-nummer.
 * - Precisie instelbaar (default 2).
 */
export function toDecimalSafe(value: any, precision: number = 2): string {
  if (value === null || value === undefined) {
    throw new Error("Missing decimal value");
  }
  if (typeof value === "string") {
    value = value.trim();
  }
  if (value === "") {
    throw new Error("Invalid decimal: empty string");
  }
  if (typeof value === "string" && value.includes(",")) {
    value = value.replace(",", ".");
  }
  const num = Number(value);
  if (Number.isNaN(num)) {
    throw new Error("Invalid decimal: not a number");
  }
  if (!Number.isFinite(num)) {
    throw new Error("Invalid decimal: not finite");
  }
  if (precision < 0 || precision > 6) {
    // bescherm tegen te veel decimals; prisma kolommen zijn beperkt
    precision = Math.max(0, Math.min(6, precision));
  }
  return num.toFixed(precision);
}

// Handige wrappers voor veelgebruikte velden
export const toMoney = (v: any) => toDecimalSafe(v, 2);      // priceInclVat
export const toVatRate = (v: any) => toDecimalSafe(v, 2);     // vatRate (bijv. 9.00 of 21.00)
export const toQuantity = (v: any) => toDecimalSafe(v, 3);    // quantity (ingrediënten)
