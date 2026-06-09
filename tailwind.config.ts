import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        canvas: "var(--canvas)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--line)",
        ember: "var(--ember)",
        moss: "var(--moss)",
        gold: "var(--gold)"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"]
      },
      boxShadow: {
        panel: "0 20px 40px rgba(15, 23, 34, 0.08)",
        glow: "0 0 0 1px rgba(37, 99, 235, 0.08), 0 20px 45px rgba(37, 99, 235, 0.12)"
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.75), transparent 30%), radial-gradient(circle at 80% 0%, rgba(177,73,48,0.12), transparent 25%), linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0))"
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulseSoft: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.03)", opacity: "0.85" }
        }
      },
      animation: {
        rise: "rise 0.7s ease forwards",
        pulseSoft: "pulseSoft 2.2s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
