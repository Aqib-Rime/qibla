import { useEffect } from "react";
import { usePrayerTimes } from "@/features/prayer-times";
import { useUserLocation } from "@/lib/use-user-location";
import {
  cancelPrayerReminders,
  schedulePrayerReminders,
} from "../lib/notifications";
import { useHydrateSettings, useSettingsStore } from "./use-settings-store";

export function usePrayerReminderSync() {
  useHydrateSettings();
  const enabled = useSettingsStore((s) => s.prayerReminders);
  const hydrated = useSettingsStore((s) => s.hydrated);
  const pos = useUserLocation();
  const { data } = usePrayerTimes(pos ? { lat: pos.lat, lng: pos.lng } : null);

  useEffect(() => {
    if (!hydrated) return;
    if (!enabled) {
      void cancelPrayerReminders();
      return;
    }
    if (!data?.timings || !pos) return;
    void schedulePrayerReminders(data.timings);
  }, [hydrated, enabled, data?.timings, pos]);
}
