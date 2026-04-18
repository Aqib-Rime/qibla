import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export const prayerTimesKeys = {
  all: ["prayerTimes"] as const,
  byCoordinates: (lat: number, lng: number, date?: string) =>
    [...prayerTimesKeys.all, "byCoordinates", lat, lng, date ?? null] as const,
}

export function usePrayerTimes(params: {
  lat: number
  lng: number
  date?: string
}) {
  return useQuery({
    queryKey: prayerTimesKeys.byCoordinates(params.lat, params.lng, params.date),
    queryFn: () => api.prayerTimes.byCoordinates(params),
    staleTime: 1000 * 60 * 60,
  })
}
