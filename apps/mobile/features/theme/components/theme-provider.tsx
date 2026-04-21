import { colorScheme } from "nativewind";
import { useEffect } from "react";
import { Appearance, View } from "react-native";
import { themeVars } from "@/lib/theme";
import { useThemeScheme } from "../hooks/use-theme-scheme";
import { useThemeStore } from "../hooks/use-theme-store";

/**
 * Wraps the app in a View that applies the active palette via NativeWind's
 * vars() helper — so `bg-surface`, `text-ink`, etc. resolve to light or
 * dark values without adding `dark:` variants at every call site.
 *
 * Also:
 *   - Hydrates the stored preference from SecureStore on mount.
 *   - Subscribes to OS appearance changes when preference is "system".
 *   - Syncs NativeWind's own colorScheme so `dark:` variants still work
 *     if we ever need them.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useThemeStore((s) => s.hydrated);
  const hydrate = useThemeStore((s) => s._hydrate);
  const setSystemScheme = useThemeStore((s) => s.setSystemScheme);
  const scheme = useThemeScheme();

  useEffect(() => {
    if (!hydrated) void hydrate();
  }, [hydrated, hydrate]);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme: cs }) => {
      setSystemScheme(cs === "dark" ? "dark" : "light");
    });
    return () => sub.remove();
  }, [setSystemScheme]);

  useEffect(() => {
    colorScheme.set(scheme);
  }, [scheme]);

  return (
    <View style={themeVars[scheme]} className="flex-1">
      {children}
    </View>
  );
}
