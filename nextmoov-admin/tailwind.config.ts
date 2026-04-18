import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#000769',
          dark: '#00020e',
          light: '#020b4a',
        },
        brand: {
          red: '#B22234',
          gold: '#C0A060',
        },
      },
    },
  },
  plugins: [],
}

export default config
