import * as SecureStore from "expo-secure-store";

const KEY = "qibla.recent-place-searches";
const MAX = 10;

export type RecentPlace = {
  placeId: string;
  name: string;
  address: string | null;
  lat: number;
  lng: number;
  searchedAt: number;
};

function isRecentPlace(value: unknown): value is RecentPlace {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.placeId === "string" &&
    typeof v.name === "string" &&
    (v.address === null || typeof v.address === "string") &&
    typeof v.lat === "number" &&
    typeof v.lng === "number" &&
    typeof v.searchedAt === "number"
  );
}

export async function getRecentPlaces(): Promise<RecentPlace[]> {
  try {
    const raw = await SecureStore.getItemAsync(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRecentPlace);
  } catch {
    return [];
  }
}

export async function pushRecentPlace(
  place: Omit<RecentPlace, "searchedAt">,
): Promise<void> {
  try {
    const current = await getRecentPlaces();
    const deduped = current.filter((p) => p.placeId !== place.placeId);
    const next: RecentPlace[] = [
      { ...place, searchedAt: Date.now() },
      ...deduped,
    ].slice(0, MAX);
    await SecureStore.setItemAsync(KEY, JSON.stringify(next));
  } catch {
    // Non-fatal — recent search history is nice-to-have, not critical.
  }
}

export async function clearRecentPlaces(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(KEY);
  } catch {}
}
