/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Qibla design tokens — keep in sync with packages/ui/src/styles/globals.css
        cream: "#faf6ec",
        surface: "#fffbf1",
        ink: "#1a2a22",
        muted: "#6b7a70",
        line: "#e6e0cc",
        green: {
          DEFAULT: "#2e5d45",
          dark: "#1f4330",
          tint: "#eef3e6",
        },
        gold: "#b68a3c",
        dark: "#0d1612",
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
}
