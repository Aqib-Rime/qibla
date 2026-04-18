import { useSavedMosques } from "@/features/mosques/hooks/use-mosques"
import { useRecentMosqueIds } from "@/features/mosques/hooks/use-recent-mosques"

export function useProfileStats() {
  const saved = useSavedMosques()
  const recent = useRecentMosqueIds()

  return {
    savedCount: saved.data?.data.length ?? 0,
    visitedCount: recent.data?.length ?? 0,
    reviewsCount: 0, // wire when reviews.mine endpoint lands
  }
}
