import { create } from "zustand"

export type FilterKey = "openOnly" | "women" | "parking" | "jummah"

export type MosqueFilters = Record<FilterKey, boolean>

const EMPTY_FILTERS: MosqueFilters = {
  openOnly: false,
  women: false,
  parking: false,
  jummah: false,
}

type State = MosqueFilters & {
  toggle: (key: FilterKey) => void
  clear: () => void
}

export const useMosqueFilters = create<State>((set) => ({
  ...EMPTY_FILTERS,
  toggle: (key) => set((s) => ({ [key]: !s[key] })),
  clear: () => set(EMPTY_FILTERS),
}))

export function countActive(filters: MosqueFilters): number {
  return (Object.keys(EMPTY_FILTERS) as FilterKey[]).filter((k) => filters[k])
    .length
}
