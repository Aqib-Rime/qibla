export const MECCA = { lat: 21.4225, lng: 39.8262 } as const

type Coord = { lat: number; lng: number }

const toRad = (deg: number) => (deg * Math.PI) / 180
const toDeg = (rad: number) => (rad * 180) / Math.PI

export function bearingToMecca(from: Coord): number {
  const phi1 = toRad(from.lat)
  const phi2 = toRad(MECCA.lat)
  const deltaLambda = toRad(MECCA.lng - from.lng)

  const y = Math.sin(deltaLambda) * Math.cos(phi2)
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda)

  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

export function distanceToMeccaKm(from: Coord): number {
  const R = 6371
  const dLat = toRad(MECCA.lat - from.lat)
  const dLng = toRad(MECCA.lng - from.lng)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) *
      Math.cos(toRad(MECCA.lat)) *
      Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

/**
 * Shortest signed delta between two bearings, in range (-180, 180].
 * Useful for deciding whether the user is close to facing qibla.
 */
export function bearingDelta(a: number, b: number): number {
  let diff = ((a - b + 540) % 360) - 180
  if (diff <= -180) diff += 360
  return diff
}
