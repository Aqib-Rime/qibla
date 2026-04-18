import { useEffect } from "react"
import { create } from "zustand"
import {
  getPrayerRemindersEnabled,
  setPrayerRemindersEnabled,
} from "../lib/settings-storage"

type State = {
  prayerReminders: boolean
  hydrated: boolean
  setPrayerReminders: (v: boolean) => void
  _hydrate: () => Promise<void>
}

export const useSettingsStore = create<State>((set) => ({
  prayerReminders: false,
  hydrated: false,
  setPrayerReminders: (v) => {
    set({ prayerReminders: v })
    void setPrayerRemindersEnabled(v)
  },
  _hydrate: async () => {
    const v = await getPrayerRemindersEnabled()
    set({ prayerReminders: v, hydrated: true })
  },
}))

export function useHydrateSettings() {
  const hydrated = useSettingsStore((s) => s.hydrated)
  const hydrate = useSettingsStore((s) => s._hydrate)
  useEffect(() => {
    if (!hydrated) void hydrate()
  }, [hydrated, hydrate])
}
