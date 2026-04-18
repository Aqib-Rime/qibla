import * as Location from "expo-location"
import { useEffect, useState } from "react"

type Position = { lat: number; lng: number }

export function useUserLocation(): Position | null {
  const [pos, setPos] = useState<Position | null>(null)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync()
        if (status !== "granted") return

        const last = await Location.getLastKnownPositionAsync()
        if (cancelled) return
        if (last) {
          setPos({ lat: last.coords.latitude, lng: last.coords.longitude })
          return
        }

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        })
        if (!cancelled) {
          setPos({
            lat: current.coords.latitude,
            lng: current.coords.longitude,
          })
        }
      } catch {
        // Silent — fall back to caller-provided default
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return pos
}
