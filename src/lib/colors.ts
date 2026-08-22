/**
 * Utility functions for color parsing and conversion (HEX, RGB, CMYK)
 */

export function cmykToHex(c: number, m: number, y: number, k: number): string {
  // Normalize 0-100 to 0-1
  const cNorm = Math.min(100, Math.max(0, c)) / 100;
  const mNorm = Math.min(100, Math.max(0, m)) / 100;
  const yNorm = Math.min(100, Math.max(0, y)) / 100;
  const kNorm = Math.min(100, Math.max(0, k)) / 100;

  const r = Math.round(255 * (1 - cNorm) * (1 - kNorm));
  const g = Math.round(255 * (1 - mNorm) * (1 - kNorm));
  const b = Math.round(255 * (1 - yNorm) * (1 - kNorm));

  return rgbToHex(r, g, b);
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.min(255, Math.max(0, Math.round(val)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function parseCustomColor(input: string): { isValid: boolean; hex: string } {
  if (!input) return { isValid: false, hex: "#7c3aed" };
  const str = input.trim().toLowerCase();

  // 1. HEX Format: #RGB, #RRGGBB, RGB, RRGGBB
  const hexMatch = str.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    return { isValid: true, hex: `#${hex}` };
  }

  // 2. RGB Format: rgb(r, g, b) or r, g, b
  const rgbMatch = str.match(/^(?:rgb\s*\(\s*)?(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*\)?$/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    if (r <= 255 && g <= 255 && b <= 255) {
      return { isValid: true, hex: rgbToHex(r, g, b) };
    }
  }

  // 3. CMYK Format: cmyk(c, m, y, k) or c, m, y, k
  const cmykMatch = str.match(/^(?:cmyk\s*\(\s*)?(\d{1,3})%?\s*[, ]\s*(\d{1,3})%?\s*[, ]\s*(\d{1,3})%?\s*[, ]\s*(\d{1,3})%?\s*\)?$/i);
  if (cmykMatch) {
    const c = parseFloat(cmykMatch[1]);
    const m = parseFloat(cmykMatch[2]);
    const y = parseFloat(cmykMatch[3]);
    const k = parseFloat(cmykMatch[4]);
    return { isValid: true, hex: cmykToHex(c, m, y, k) };
  }

  return { isValid: false, hex: "#7c3aed" };
}
