/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF7F1",
        card: "#FFFFFF",
        ink: "#10262A",
        muted: "#5F6B69",
        line: "#E8E2D7",
        cross: { DEFAULT: "#0F7C6B", deep: "#0B5C50", soft: "#DCF0EA", mist: "#EEF6F2" },
        peach: "#F5D8C2",
      },
      fontFamily: {
        display: ['"Tilt Neon"', "system-ui", "sans-serif"],
        sans: ['"Plus Jakarta Sans"', '"Helvetica Neue"', "system-ui", "sans-serif"],
        mono: ['"DM Mono"', "ui-monospace", "Menlo", "monospace"],
      },
      keyframes: {
        "shimmer-slide": { to: { transform: "translate(calc(100cqw - 100%), 0)" } },
        "spin-around": { "0%": { transform: "translateZ(0) rotate(0)" }, "15%, 35%": { transform: "translateZ(0) rotate(90deg)" }, "65%, 85%": { transform: "translateZ(0) rotate(270deg)" }, "100%": { transform: "translateZ(0) rotate(360deg)" } },
      },
      animation: {
        "shimmer-slide": "shimmer-slide var(--speed) ease-in-out infinite alternate",
        "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
      },
    },
  },
  plugins: [],
};
