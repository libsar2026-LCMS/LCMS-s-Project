import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B3A6B",
          light: "#2E5DA8",
        },
        accent: {
          DEFAULT: "#C8102E",
          light: "#E63950",
        },
        success: "#16A34A",
        warning: "#D97706",
        background: "#F8FAFC",
        surface: "#FFFFFF",
        border: "#E2E8F0",
        "text-primary": "#0F172A",
        "text-secondary": "#64748B",
      },
      fontFamily: {
        sans:    ["var(--font-inter)",    "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
