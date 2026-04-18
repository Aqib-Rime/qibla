import * as Location from "expo-location"
import { useEffect, useRef, useState } from "react"

export type HeadingAccuracy = "low" | "medium" | "high"

export type DeviceHeading = {
  heading: number
  accuracy: HeadingAccuracy
} | null

function mapAccuracy(raw: number | undefined): HeadingAccuracy {
  if (raw == null) return "medium"
  if (raw >= 2) return "high"
  if (raw === 1) return "medium"
  return "low"
}

/** EMA on a circular quantity. Alpha closer to 1 = more responsive, less smooth. */
function smoothCircular(prev: number | null, next: number, alpha: number) {
  if (prev == null) return next
  const diff = ((next - prev + 540) % 360) - 180
  return (prev + alpha * diff + 360) % 360
}

const SMOOTHING_ALPHA = 0.22

export function useDeviceHeading(): DeviceHeading {
  const [heading, setHeading] = useState<DeviceHeading>(null)
  const smoothedRef = useRef<number | null>(null)

  useEffect(() => {
    let sub: Location.LocationSubscription | null = null
    let cancelled = false

    ;(async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync()
        if (status !== "granted" || cancelled) return

        sub = await Location.watchHeadingAsync((data) => {
          const raw =
            data.trueHeading >= 0 ? data.trueHeading : data.magHeading
          const next = (raw + 360) % 360
          const smoothed = smoothCircular(
            smoothedRef.current,
            next,
            SMOOTHING_ALPHA
          )
          smoothedRef.current = smoothed

          setHeading({
            heading: smoothed,
            accuracy: mapAccuracy(data.accuracy),
          })
        })
      } catch {
        // Sensor unavailable — caller falls back
      }
    })()

    return () => {
      cancelled = true
      sub?.remove()
    }
  }, [])

  return heading
}
