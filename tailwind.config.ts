import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["selector", 'html[data-color-mode="dark"]'],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sora)", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        background: "var(--color-bg)",
        foreground: "var(--color-text)",
        accent: "var(--color-accent)",
        divider: "var(--color-divider)",
      },
      maxWidth: {
        container: "1300px",
        wide: "1800px",
      },
      borderRadius: {
        card: "20px",
      },
      backgroundImage: {
        "accent-gradient":
          "linear-gradient(100deg, var(--color-accent) 0%, #0a1630 50%, var(--color-accent) 100%)",
        "accent-gradient-soft":
          "linear-gradient(110deg, var(--color-accent) 0.26%, #0a1630 99.99%)",
      },
      keyframes: {
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 1.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
