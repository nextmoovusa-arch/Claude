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
        navy: {
          DEFAULT: "#000769",
          50: "#e6e6f5",
          100: "#c0c0e6",
          600: "#000555",
          700: "#000444",
          900: "#000222",
        },
        "red-flag": "#BF0A30",
        "red-dark": "#990825",
        ink: "#0A0A0A",
        graphite: "#3D3D3D",
        stone: "#6B6B6B",
        paper: "#FAFAF7",
        cream: "#F5F1E8",
        gold: "#A68C5B",
        line: "#D4D4D4",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "4px",
        sm: "2px",
        md: "4px",
        lg: "6px",
      },
    },
  },
  plugins: [],
}

export default config
