export type Timings = {
  fajr: string
  sunrise: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
}

export type PrayerName = keyof Timings

export const PRAYER_ORDER: PrayerName[] = [
  "fajr",
  "sunrise",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
]

export const PRAYER_LABEL: Record<PrayerName, string> = {
  fajr: "Fajr",
  sunrise: "Sunrise",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map((n) => Number.parseInt(n, 10))
  return (h ?? 0) * 60 + (m ?? 0)
}

export function nextPrayer(
  timings: Timings,
  now: Date = new Date()
): { name: PrayerName; time: string; tomorrow: boolean } {
  const nowMin = now.getHours() * 60 + now.getMinutes()
  for (const name of PRAYER_ORDER) {
    const t = timings[name]
    if (!t) continue
    if (toMinutes(t) > nowMin) return { name, time: t, tomorrow: false }
  }
  return { name: "fajr", time: timings.fajr, tomorrow: true }
}

export function formatTime12(hhmm: string): string {
  const [hRaw, mRaw] = hhmm.split(":")
  const h = Number.parseInt(hRaw ?? "0", 10)
  const m = Number.parseInt(mRaw ?? "0", 10)
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm
  const period = h >= 12 ? "PM" : "AM"
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, "0")} ${period}`
}
