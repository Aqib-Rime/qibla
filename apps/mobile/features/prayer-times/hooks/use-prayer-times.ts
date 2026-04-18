import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export const prayerTimesKeys = {
  all: ["prayerTimes"] as const,
  byCoordinates: (lat: number, lng: number, date?: string) =>
    [...prayerTimesKeys.all, "byCoordinates", lat, lng, date ?? null] as const,
}

export function usePrayerTimes(
  params: { lat: number; lng: number; date?: string } | null | undefined
) {
  return useQuery({
    enabled: !!params,
    queryKey: prayerTimesKeys.byCoordinates(
      params?.lat ?? 0,
      params?.lng ?? 0,
      params?.date
    ),
    queryFn: () =>
      api.prayerTimes.byCoordinates(params as { lat: number; lng: number }),
    staleTime: 1000 * 60 * 60,
  })
}
