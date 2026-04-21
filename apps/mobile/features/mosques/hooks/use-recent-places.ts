import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  clearRecentPlaces,
  getRecentPlaces,
  pushRecentPlace,
  type RecentPlace,
} from "../lib/recent-places-storage";

export const recentPlacesKeys = {
  all: ["recent-places"] as const,
};

export function useRecentPlaces() {
  return useQuery({
    queryKey: recentPlacesKeys.all,
    queryFn: getRecentPlaces,
  });
}

export function usePushRecentPlace() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (place: Omit<RecentPlace, "searchedAt">) =>
      pushRecentPlace(place),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: recentPlacesKeys.all });
    },
  });
}

export function useClearRecentPlaces() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: clearRecentPlaces,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: recentPlacesKeys.all });
    },
  });
}
