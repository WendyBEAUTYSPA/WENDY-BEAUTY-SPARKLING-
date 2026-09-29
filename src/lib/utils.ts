export function formatNaira(amount: number): string {
  return "₦" + amount.toLocaleString("en-NG");
}

export function slugify(input: string): string {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export const PAGE_SIZE = 24;