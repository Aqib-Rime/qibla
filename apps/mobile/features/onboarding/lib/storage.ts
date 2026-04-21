import * as SecureStore from "expo-secure-store";

const KEY = "qibla.onboarded";

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const v = await SecureStore.getItemAsync(KEY);
    return v === "1";
  } catch {
    return false;
  }
}

export async function markOnboardingCompleted(): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEY, "1");
  } catch {
    // Non-fatal — worst case we re-onboard on next launch
  }
}
