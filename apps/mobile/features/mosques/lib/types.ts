import type { api } from "@/lib/api";

type MosqueListRow = NonNullable<
  Awaited<ReturnType<typeof api.mosques.list>>["data"]
>[number];

// distanceKm is present only when the row comes from mosques.nearby.
// Keeping it optional lets the map feed either endpoint's result into
// the same consumer components without narrowing per call site.
export type MosqueListItem = MosqueListRow & { distanceKm?: number };

export type MosqueDetail = Awaited<ReturnType<typeof api.mosques.byId>>;

export type Mosque = MosqueDetail["mosque"];
export type Imam = MosqueDetail["imam"];
export type Event = MosqueDetail["events"][number];
export type Review = MosqueDetail["reviews"][number];
