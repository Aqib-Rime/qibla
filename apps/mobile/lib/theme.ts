// JS mirror of the Tailwind color tokens in tailwind.config.js.
// Use these for RN props (color, tintColor, etc.) that can't accept classNames,
// so we stay in sync with the design tokens and can swap for dark mode later.
export const colors = {
  cream: "#faf6ec",
  surface: "#fffbf1",
  ink: "#1a2a22",
  muted: "#6b7a70",
  line: "#e6e0cc",
  green: "#2e5d45",
  greenDark: "#1f4330",
  greenTint: "#eef3e6",
  gold: "#b68a3c",
  goldTint: "#f4ead0",
  danger: "#b04a3a",
  dangerTint: "#f8e4df",
  dark: "#0d1612",
  white: "#ffffff",
} as const;
