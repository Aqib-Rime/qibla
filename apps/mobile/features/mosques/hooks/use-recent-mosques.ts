import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  clearRecentMosqueIds,
  getRecentMosqueIds,
  pushRecentMosqueId,
} from "../lib/recent-storage";

export const recentMosquesKeys = {
  all: ["recent-mosques"] as const,
};

export function useRecentMosqueIds() {
  return useQuery({
    queryKey: recentMosquesKeys.all,
    queryFn: getRecentMosqueIds,
  });
}

export function usePushRecentMosque() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: pushRecentMosqueId,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: recentMosquesKeys.all });
    },
  });
}

export function useClearRecentMosques() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: clearRecentMosqueIds,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: recentMosquesKeys.all });
    },
  });
}
