import { create } from "zustand";

export type FilterKey = "openOnly" | "women" | "parking" | "jummah";

export type MosqueFilters = Record<FilterKey, boolean> & {
  radiusKm: number | null;
};

const EMPTY_FILTERS: MosqueFilters = {
  openOnly: false,
  women: false,
  parking: false,
  jummah: false,
  radiusKm: null,
};

type State = MosqueFilters & {
  toggle: (key: FilterKey) => void;
  setRadius: (radiusKm: number | null) => void;
  clear: () => void;
};

export const useMosqueFilters = create<State>((set) => ({
  ...EMPTY_FILTERS,
  toggle: (key) => set((s) => ({ [key]: !s[key] })),
  setRadius: (radiusKm) => set({ radiusKm }),
  clear: () => set(EMPTY_FILTERS),
}));

export function countActive(filters: MosqueFilters): number {
  const boolKeys: FilterKey[] = ["openOnly", "women", "parking", "jummah"];
  const toggles = boolKeys.filter((k) => filters[k]).length;
  const radius = filters.radiusKm != null ? 1 : 0;
  return toggles + radius;
}
