import type { api } from "@/lib/api"

export type MosqueListItem = NonNullable<
  Awaited<ReturnType<typeof api.mosques.list>>["data"]
>[number]

export type MosqueDetail = Awaited<ReturnType<typeof api.mosques.byId>>

export type Mosque = MosqueDetail["mosque"]
export type Imam = MosqueDetail["imam"]
export type Event = MosqueDetail["events"][number]
export type Review = MosqueDetail["reviews"][number]
