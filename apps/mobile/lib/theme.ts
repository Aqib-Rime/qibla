import { vars } from "nativewind";
import { useThemeScheme } from "@/features/theme/hooks/use-theme-scheme";

export type ThemePalette = {
  cream: string;
  surface: string;
  ink: string;
  muted: string;
  line: string;
  green: string;
  greenDark: string;
  greenTint: string;
  gold: string;
  goldTint: string;
  danger: string;
  dangerTint: string;
  dark: string;
  white: string;
  switchTrackOff: string;
};

export type ThemeScheme = "light" | "dark";

// Palette — single source of truth for both Tailwind CSS-var resolution
// (via the ThemeProvider) and raw RN props that can't take classNames
// (Icon color, placeholderTextColor, StatusBar, Switch trackColor, etc.).
//
// Design brief:
//   Light: neutral paper feel — pure-white cards on a barely-warm canvas,
//          so the brand greens/golds read clean rather than cartoonish.
//   Dark:  cool graphite with a hint of green — off-white text, NOT cream.
const light: ThemePalette = {
  cream: "#f5f3ec",
  surface: "#ffffff",
  ink: "#1a2a22",
  muted: "#6b7a70",
  line: "#e8e5db",
  green: "#2e5d45",
  greenDark: "#1f4330",
  greenTint: "#eef3e6",
  gold: "#b68a3c",
  goldTint: "#f4ead0",
  danger: "#b04a3a",
  dangerTint: "#f8e4df",
  dark: "#0d1612",
  white: "#ffffff",
  switchTrackOff: "#d7ddd4",
};

const dark: ThemePalette = {
  cream: "#0e1311",
  surface: "#181d1a",
  ink: "#e8ebe6",
  muted: "#8a948f",
  line: "#242a27",
  green: "#5ba17a",
  greenDark: "#3a7a59",
  greenTint: "#1a2620",
  gold: "#d4a85a",
  goldTint: "#2a241a",
  danger: "#d87060",
  dangerTint: "#2a1a17",
  dark: "#000000",
  white: "#f5f7f3",
  switchTrackOff: "#2a302d",
};

export const palettes: Record<ThemeScheme, ThemePalette> = {
  light,
  dark,
};

// Tailwind uses `rgb(var(--x) / <alpha-value>)`, which requires the var
// to hold a space-separated RGB triplet — "232 229 219", not a hex.
// Without this, alpha modifiers like `border-line/80` silently fail and
// the browser falls back to black, which looks like a harsh black border.
function hexToRgb(hex: string): string {
  const v = hex.replace("#", "");
  const full =
    v.length === 3
      ? v
          .split("")
          .map((c) => c + c)
          .join("")
      : v;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

function paletteToVars(p: ThemePalette) {
  return {
    "--color-cream": hexToRgb(p.cream),
    "--color-surface": hexToRgb(p.surface),
    "--color-ink": hexToRgb(p.ink),
    "--color-muted": hexToRgb(p.muted),
    "--color-line": hexToRgb(p.line),
    "--color-green": hexToRgb(p.green),
    "--color-green-dark": hexToRgb(p.greenDark),
    "--color-green-tint": hexToRgb(p.greenTint),
    "--color-gold": hexToRgb(p.gold),
    "--color-gold-tint": hexToRgb(p.goldTint),
    "--color-danger": hexToRgb(p.danger),
    "--color-danger-tint": hexToRgb(p.dangerTint),
    "--color-dark": hexToRgb(p.dark),
  };
}

export const themeVars = {
  light: vars(paletteToVars(light)),
  dark: vars(paletteToVars(dark)),
};

/**
 * Returns the active palette for the current scheme.
 * Use for RN props that cannot take classNames:
 *   const colors = useThemeColors();
 *   <Icon color={colors.muted} />
 */
export function useThemeColors(): ThemePalette {
  const scheme = useThemeScheme();
  return palettes[scheme];
}
