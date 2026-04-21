import * as SecureStore from "expo-secure-store";

const KEY = "qibla.theme-preference";

export type ThemePreference = "system" | "light" | "dark";

export async function getThemePreference(): Promise<ThemePreference> {
  try {
    const v = await SecureStore.getItemAsync(KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {}
  return "system";
}

export async function setThemePreference(pref: ThemePreference): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEY, pref);
  } catch {}
}
