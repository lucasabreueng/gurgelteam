import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["selector", 'html[data-color-mode="dark"]'],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
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
        ds: {
          page: "var(--ds-bg-page)",
          panel: "var(--ds-bg-panel)",
          card: "var(--ds-bg-card)",
          muted: "var(--ds-bg-muted)",
          input: "var(--ds-bg-input)",
          elevated: "var(--ds-bg-elevated)",
          border: "var(--ds-border)",
          "text-primary": "var(--ds-text-primary)",
          "text-body": "var(--ds-text-body)",
          "text-secondary": "var(--ds-text-secondary)",
          "text-muted": "var(--ds-text-muted)",
        },
      },
      maxWidth: {
        container: "1300px",
        wide: "1800px",
      },
      borderRadius: {
        card: "20px",
      },
      backgroundImage: {
        /* Mantidos por compatibilidade — cor sólida, sem gradiente */
        "accent-gradient": "none",
        "accent-gradient-soft": "none",
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
