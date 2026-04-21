/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      // Colors resolve through CSS variables set by the ThemeProvider via
      // NativeWind's vars() helper. The `rgb(var(...) / <alpha-value>)`
      // pattern lets alpha modifiers (e.g. `border-line/80`) work —
      // without it, Tailwind silently drops the alpha and the browser
      // falls back to black. CSS vars therefore store RGB triplets
      // (e.g. "232 229 219"), not hex. Raw palette and conversion
      // live in apps/mobile/lib/theme.ts.
      colors: {
        cream: "rgb(var(--color-cream) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        green: {
          DEFAULT: "rgb(var(--color-green) / <alpha-value>)",
          dark: "rgb(var(--color-green-dark) / <alpha-value>)",
          tint: "rgb(var(--color-green-tint) / <alpha-value>)",
        },
        gold: {
          DEFAULT: "rgb(var(--color-gold) / <alpha-value>)",
          tint: "rgb(var(--color-gold-tint) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "rgb(var(--color-danger) / <alpha-value>)",
          tint: "rgb(var(--color-danger-tint) / <alpha-value>)",
        },
        dark: "rgb(var(--color-dark) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Geist_400Regular"],
        "sans-medium": ["Geist_500Medium"],
        "sans-semibold": ["Geist_600SemiBold"],
        mono: ["GeistMono_400Regular"],
      },
      fontSize: {
        "display-xl": ["40px", { lineHeight: "42px", letterSpacing: "-1.4px" }],
        "display-lg": ["30px", { lineHeight: "32px", letterSpacing: "-1px" }],
        "display-md": ["22px", { lineHeight: "25px", letterSpacing: "-0.6px" }],
        "display-sm": ["17px", { lineHeight: "21px", letterSpacing: "-0.3px" }],
        title: ["17px", { lineHeight: "22px", letterSpacing: "-0.2px" }],
        body: ["15px", { lineHeight: "22px", letterSpacing: "-0.1px" }],
        "body-sm": ["13px", { lineHeight: "19px" }],
        label: ["13px", { lineHeight: "17px", letterSpacing: "-0.1px" }],
        caption: ["11px", { lineHeight: "15px", letterSpacing: "0.3px" }],
        eyebrow: ["10px", { lineHeight: "14px", letterSpacing: "1.6px" }],
      },
      borderRadius: {
        sm: "10px",
        md: "14px",
        lg: "18px",
        xl: "24px",
        pill: "999px",
      },
      spacing: {
        "s-1": "4px",
        "s-2": "8px",
        "s-3": "12px",
        "s-4": "16px",
        "s-5": "20px",
        "s-6": "24px",
        "s-7": "32px",
        "s-8": "40px",
        "s-9": "48px",
        "s-10": "64px",
      },
    },
  },
  plugins: [],
};
