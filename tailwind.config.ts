import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0c1929",
          light: "#152238",
          dark: "#070f18",
        },
        cream: {
          DEFAULT: "#FAF9F6",
          dark: "#f0ebe3",
        },
        gold: {
          DEFAULT: "#C5A059",
          light: "#E8DCC8",
          dark: "#B8934A",
        },
        brand: {
          DEFAULT: "#00A95C",
          hover: "#059669",
          light: "#ECFDF5",
          dark: "#047857",
        },
        accent: {
          DEFAULT: "#C5A059",
          light: "#E8DCC8",
          dark: "#B8934A",
          glow: "rgba(197, 160, 89, 0.55)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "76rem",
      },
      boxShadow: {
        firm: "0 25px 50px -12px rgba(12, 25, 41, 0.35)",
        elevated: "0 4px 24px rgba(12, 25, 41, 0.12)",
        demo: "0 32px 64px -16px rgba(197, 160, 89, 0.3), 0 0 0 1px rgba(197, 160, 89, 0.15)",
        neon: "0 0 24px rgba(197, 160, 89, 0.4), 0 0 48px rgba(197, 160, 89, 0.18)",
        "neon-lg": "0 0 32px rgba(197, 160, 89, 0.55), 0 0 64px rgba(197, 160, 89, 0.25)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "line-grow": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "paper-drift-1": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(3%, 2%) scale(1.05)" },
        },
        "paper-drift-2": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-2%, -3%) scale(1.08)" },
        },
        "neon-pulse": {
          "0%, 100%": { opacity: "0.85" },
          "50%": { opacity: "1" },
        },
        "chat-dot-bounce": {
          "0%, 80%, 100%": { transform: "translateY(0)", opacity: "0.35" },
          "40%": { transform: "translateY(-5px)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out forwards",
        "line-grow": "line-grow 0.8s ease-out forwards",
        blink: "blink 1s step-end infinite",
        "paper-drift-1": "paper-drift-1 18s ease-in-out infinite",
        "paper-drift-2": "paper-drift-2 22s ease-in-out infinite",
        "neon-pulse": "neon-pulse 3s ease-in-out infinite",
        "chat-dot-bounce": "chat-dot-bounce 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}

export default config
