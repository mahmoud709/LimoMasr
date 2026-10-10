/** Validate contact numbers without restricting customers to one country. */
export function normalizeBookingPhone(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const phone = value.trim()
    .replace(/[\u0660-\u0669]/g, digit => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[\u06f0-\u06f9]/g, digit => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[\u200e\u200f]/g, "");
  if (!/^\+?[\d ()\.\-]+$/.test(phone)) return null;
  const digits = phone.replace(/\D/g, "");
  // Reject blanks, country codes alone and implausibly short/long numbers.
  if (digits.length < 7 || digits.length > 15 || !/[1-9]/.test(digits)) return null;
  return (phone.startsWith("+") ? "+" : "") + digits;
}
