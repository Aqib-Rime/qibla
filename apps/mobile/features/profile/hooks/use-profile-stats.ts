import { useQuery } from "@tanstack/react-query";
import { useSavedMosques } from "@/features/mosques/hooks/use-mosques";
import { useRecentMosqueIds } from "@/features/mosques/hooks/use-recent-mosques";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth";

export function useProfileStats() {
  const saved = useSavedMosques();
  const recent = useRecentMosqueIds();
  const { data: session } = useSession();

  const reviews = useQuery({
    queryKey: ["reviews", "mine", "count"] as const,
    queryFn: () => api.reviews.mine({}),
    enabled: Boolean(session?.user),
  });

  return {
    savedCount: saved.data?.data.length ?? 0,
    visitedCount: recent.data?.length ?? 0,
    reviewsCount: reviews.data?.total ?? 0,
  };
}
