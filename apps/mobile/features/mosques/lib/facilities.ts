import type { IconName } from "@/components/ui/icon"

export const FACILITY_META: Record<string, { label: string; icon: IconName }> =
  {
    wudu: { label: "Wudu", icon: "wifi" },
    women: { label: "Women", icon: "users" },
    parking: { label: "Parking", icon: "parking" },
    ac: { label: "AC", icon: "ac" },
    book: { label: "Madrasa", icon: "book" },
    elevator: { label: "Elevator", icon: "arrow" },
  }

export function resolveFacilities(keys: readonly string[]) {
  return keys
    .map((key) => ({ key, meta: FACILITY_META[key] }))
    .filter(
      (f): f is { key: string; meta: (typeof FACILITY_META)[string] } =>
        Boolean(f.meta)
    )
}
