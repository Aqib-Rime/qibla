import * as SecureStore from "expo-secure-store";

const PRAYER_REMINDERS_KEY = "qibla:prayer-reminders";

export async function getPrayerRemindersEnabled(): Promise<boolean> {
  try {
    return (await SecureStore.getItemAsync(PRAYER_REMINDERS_KEY)) === "1";
  } catch {
    return false;
  }
}

export async function setPrayerRemindersEnabled(v: boolean): Promise<void> {
  try {
    if (v) await SecureStore.setItemAsync(PRAYER_REMINDERS_KEY, "1");
    else await SecureStore.deleteItemAsync(PRAYER_REMINDERS_KEY);
  } catch {
    // Non-fatal — toggle will resync on next launch
  }
}
