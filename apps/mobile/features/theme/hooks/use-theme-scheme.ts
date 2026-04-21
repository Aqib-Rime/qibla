import { resolveScheme, useThemeStore } from "./use-theme-store";

/**
 * Returns the effective scheme ("light" | "dark") — the user preference,
 * falling back to the OS scheme when preference is "system".
 */
export function useThemeScheme(): "light" | "dark" {
  const preference = useThemeStore((s) => s.preference);
  const systemScheme = useThemeStore((s) => s.systemScheme);
  return resolveScheme(preference, systemScheme);
}
