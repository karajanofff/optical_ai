/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#07111F",
        panel: "#0E1A2B",
        accent: "#2DD4BF",
        warning: "#F59E0B",
        danger: "#EF4444",
        ink: "#E2E8F0"
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Segoe UI", "sans-serif"]
      },
      boxShadow: {
        premium: "0 24px 80px rgba(2, 6, 23, 0.35)"
      }
    }
  },
  plugins: []
};
