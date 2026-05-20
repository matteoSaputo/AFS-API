export function cleanString(value: unknown): string | null {
  const s = String(value ?? "").trim();
  return s || null;
}

export function digitsOnly(value: unknown): string | null {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits || null;
}

export function cleanState(value: unknown): string | null {
  const s = String(value ?? "").trim().toUpperCase();
  return s || null;
}

export function parseNumber(value: unknown): number | null {
  const s = String(value ?? "").replace(/,/g, "").trim();
  if (!s) return null;

  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

export function parseUsDate(value: unknown): string | null {
  const s = String(value ?? "").trim();
  if (!s) return null;

  const [mm, dd, yyyy] = s.split("/");
  if (!mm || !dd || !yyyy) return s;

  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}