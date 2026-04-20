import type { MosqueFilters } from "./filters-store";
import type { MosqueListItem } from "./types";

export function applyFilters(
  mosques: readonly MosqueListItem[],
  filters: MosqueFilters,
): MosqueListItem[] {
  return mosques.filter((m) => {
    if (filters.openOnly && !m.open) return false;
    if (filters.women && !m.facilities.includes("women")) return false;
    if (filters.parking && !m.facilities.includes("parking")) return false;
    if (filters.jummah && !m.tags.includes("Jummah")) return false;
    return true;
  });
}

export function applySearch(
  mosques: readonly MosqueListItem[],
  query: string,
): MosqueListItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...mosques];
  return mosques.filter((m) => {
    if (m.name.toLowerCase().includes(q)) return true;
    if (m.subtitle?.toLowerCase().includes(q)) return true;
    if (m.area?.toLowerCase().includes(q)) return true;
    if (m.address?.toLowerCase().includes(q)) return true;
    return false;
  });
}
