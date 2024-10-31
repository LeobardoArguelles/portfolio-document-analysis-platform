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
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#2b4ff7", // Professional blue for main actions
          light: "#476eff",
          dark: "#1d3ee6",
        },
        secondary: {
          DEFAULT: "#5c5e6a", // Neutral gray for supporting elements
          light: "#7d7f88",
          dark: "#494b57",
        },
        accent: {
          DEFAULT: "#4c63c9", // Softer blue for highlights
          light: "#6177dd",
          dark: "#3b4ea1",
        },
        background: {
          DEFAULT: "#f9fafb", // Light gray for main background (light mode)
          dark: "#121418", // Dark blue-gray for main background (dark mode)
        },
        surface: {
          DEFAULT: "#ffffff", // Pure white for cards (light mode)
          dark: "#1a1d23", // Darker blue-gray for cards (dark mode)
        },
        text: {
          DEFAULT: "#1f2937", // Dark gray for primary text (light mode)
          light: "#4b5563", // Medium gray for secondary text (light mode)
          dark: "#f3f4f6", // Light gray for primary text (dark mode)
          "dark-light": "#d1d5db", // Medium gray for secondary text (dark mode)
        },
        border: {
          DEFAULT: "#e4e5e7", // Light gray for borders (light mode)
          dark: "#2e3035", // Dark gray for borders (dark mode)
        },
        success: {
          DEFAULT: "#059669", // Green for validations
          light: "#10b981",
          dark: "#047857",
        },
        error: {
          DEFAULT: "#dc2626", // Red for critical issues
          light: "#ef4444",
          dark: "#b91c1c",
        },
        warning: {
          DEFAULT: "#d97706", // Amber for warnings
          light: "#f59e0b",
          dark: "#b45309",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
