import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
  PRAYER_LABEL,
  PRAYER_ORDER,
  type PrayerName,
  type Timings,
} from "@/features/prayer-times";

const ID_PREFIX = "qibla-prayer-";
const CHANNEL_ID = "prayer-reminders";

function idFor(name: PrayerName): string {
  return `${ID_PREFIX}${name}`;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const next = await Notifications.requestPermissionsAsync();
  return next.granted;
}

async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: "Prayer reminders",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "default",
  });
}

export async function cancelPrayerReminders(): Promise<void> {
  await Promise.all(
    PRAYER_ORDER.map((name) =>
      Notifications.cancelScheduledNotificationAsync(idFor(name)).catch(
        () => {},
      ),
    ),
  );
}

function parseHM(hhmm: string): { hour: number; minute: number } | null {
  const [h, m] = hhmm.split(":").map((n) => Number.parseInt(n, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return { hour: h, minute: m };
}

export async function schedulePrayerReminders(timings: Timings): Promise<void> {
  await ensureAndroidChannel();
  await cancelPrayerReminders();

  for (const name of PRAYER_ORDER) {
    if (name === "sunrise") continue;
    const hm = parseHM(timings[name]);
    if (!hm) continue;
    const label = PRAYER_LABEL[name];
    await Notifications.scheduleNotificationAsync({
      identifier: idFor(name),
      content: {
        title: `${label} prayer`,
        body: `It's time for ${label}.`,
        sound: "default",
        ...(Platform.OS === "android" && { channelId: CHANNEL_ID }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hm.hour,
        minute: hm.minute,
      },
    });
  }
}
