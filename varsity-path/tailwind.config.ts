import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary blue (Abby-style)
        primary: {
          DEFAULT: "#2563EB",
          50:  "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
        },
        // Legacy navy → remapped to blue for backward compat
        navy: {
          DEFAULT: "#2563EB",
          50:  "#EFF6FF",
          100: "#DBEAFE",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        // Neutrals
        ink:      "#111827",
        graphite: "#374151",
        stone:    "#6B7280",
        mist:     "#E5E7EB",
        paper:    "#F9FAFB",
        white:    "#FFFFFF",
        line:     "#E5E7EB",
        cream:    "#F3F4F6",
        // Status
        "status-green":  "#22C55E",
        "status-blue":   "#3B82F6",
        "status-amber":  "#F59E0B",
        "status-red":    "#EF4444",
        "status-purple": "#A855F7",
        // Accents (kept for backward compat)
        coral:      "#EF4444",
        gold:       "#F59E0B",
        "red-flag": "#EF4444",
        "red-dark": "#DC2626",
      },
      fontFamily: {
        sans:    ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        xs:    ["11px", { lineHeight: "1.4" }],
        sm:    ["13px", { lineHeight: "1.45" }],
        base:  ["14px", { lineHeight: "1.5" }],
        lg:    ["16px", { lineHeight: "1.5" }],
        xl:    ["18px", { lineHeight: "1.4" }],
        "2xl": ["22px", { lineHeight: "1.3" }],
        "3xl": ["28px", { lineHeight: "1.25" }],
      },
      borderRadius: {
        DEFAULT: "8px",
        sm:   "4px",
        md:   "8px",
        lg:   "10px",
        xl:   "12px",
        "2xl":"16px",
        full: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)",
        pop:  "0 4px 12px 0 rgba(0,0,0,0.12)",
        sm:   "0 1px 2px 0 rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
}

export default config
