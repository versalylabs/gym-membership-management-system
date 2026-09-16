import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        onyx: {
          DEFAULT: "#111315",
          900: "#111315",
          950: "#0b0c0d",
        },
        carbon: {
          DEFAULT: "#202427",
          700: "#2c3236",
          800: "#202427",
          900: "#171a1c",
        },
        chartreuse: {
          DEFAULT: "#C8FF3D",
          400: "#d9ff66",
          500: "#C8FF3D",
          600: "#aee624",
          700: "#92c416",
        },
        parchment: {
          DEFAULT: "#F4F3EE",
          100: "#F4F3EE",
          200: "#e4e3dd",
          300: "#d1cfc7",
          400: "#b5b3aa",
        },
        olive: {
          DEFAULT: "#8C9390",
          300: "#a6aca9",
          400: "#99a09d",
          500: "#8C9390",
          600: "#757c79",
          700: "#5e6461",
        },
        brand: {
          50: "#f7fee7",
          100: "#ecfccb",
          500: "var(--brand-primary, #C8FF3D)",
          600: "var(--brand-600, #aee624)",
          700: "var(--brand-700, #92c416)",
          accent: "var(--brand-accent, #8C9390)",
          dark: "var(--brand-dark, #111315)",
          carbon: "var(--brand-carbon, #202427)",
          parchment: "var(--brand-parchment, #F4F3EE)",
          olive: "var(--brand-olive, #8C9390)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
