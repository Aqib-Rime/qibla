import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

/**
 * Hook to wire up pull-to-refresh on a ScrollView or FlatList.
 *
 * Pass the query keys you want invalidated on pull. Pass an empty array
 * (or no argument) to invalidate every TanStack Query in the cache — cheap
 * and simple for screens that show data from several disparate sources.
 *
 * Usage:
 *   const { refreshing, onRefresh } = usePullToRefresh([
 *     ["mosques", "saved"],
 *     ["my-submissions"],
 *   ]);
 *   <ScrollView
 *     refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
 *   >
 */
export function usePullToRefresh(
  queryKeys: ReadonlyArray<readonly unknown[]> = [],
) {
  const qc = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (queryKeys.length === 0) {
        await qc.invalidateQueries();
      } else {
        await Promise.all(
          queryKeys.map((key) => qc.invalidateQueries({ queryKey: key })),
        );
      }
    } finally {
      setRefreshing(false);
    }
    // queryKeys is assumed stable — pass a module-level constant from the
    // caller to avoid recreating the callback every render.
  }, [qc, queryKeys]);

  return { refreshing, onRefresh };
}
