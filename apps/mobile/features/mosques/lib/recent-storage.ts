import * as SecureStore from "expo-secure-store"

const KEY = "qibla:recent-mosques"
const MAX = 8

export async function getRecentMosqueIds(): Promise<string[]> {
  try {
    const raw = await SecureStore.getItemAsync(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === "string")
      : []
  } catch {
    return []
  }
}

export async function pushRecentMosqueId(id: string): Promise<void> {
  try {
    const current = await getRecentMosqueIds()
    const next = [id, ...current.filter((x) => x !== id)].slice(0, MAX)
    await SecureStore.setItemAsync(KEY, JSON.stringify(next))
  } catch {
    // Non-fatal
  }
}

export async function clearRecentMosqueIds(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(KEY)
  } catch {}
}
