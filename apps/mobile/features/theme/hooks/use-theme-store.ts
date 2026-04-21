import { Appearance } from "react-native";
import { create } from "zustand";
import {
  getThemePreference,
  setThemePreference,
  type ThemePreference,
} from "../lib/theme-storage";

type State = {
  preference: ThemePreference;
  systemScheme: "light" | "dark";
  hydrated: boolean;
  setPreference: (pref: ThemePreference) => void;
  setSystemScheme: (s: "light" | "dark") => void;
  _hydrate: () => Promise<void>;
};

export const useThemeStore = create<State>((set) => ({
  preference: "system",
  systemScheme: Appearance.getColorScheme() === "dark" ? "dark" : "light",
  hydrated: false,
  setPreference: (pref) => {
    set({ preference: pref });
    void setThemePreference(pref);
  },
  setSystemScheme: (s) => set({ systemScheme: s }),
  _hydrate: async () => {
    const pref = await getThemePreference();
    set({ preference: pref, hydrated: true });
  },
}));

export function resolveScheme(
  preference: ThemePreference,
  systemScheme: "light" | "dark",
): "light" | "dark" {
  return preference === "system" ? systemScheme : preference;
}
