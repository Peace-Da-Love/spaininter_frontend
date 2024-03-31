import type { Config } from "tailwindcss"
import { fontFamily } from 'tailwindcss/defaultTheme';

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  future: {
    hoverOnlyWhenSupported: true
  },
  theme: {
    container: {
      center: true,
      padding: '0.625rem',
      screens: {
        "2xl": "1460px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--montserrat-font)', ...fontFamily.sans]
      },
      colors: {
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        background: "hsl(var(--background))",
        card: "hsl(var(--card))",
        "light-blue": "hsl(var(--light-blue))",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config