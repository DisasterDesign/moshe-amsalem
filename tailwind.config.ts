import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#C9A962",
          light: "#D4B872",
          dark: "#B89952",
        },
        dark: {
          DEFAULT: "#0A0A0A",
          secondary: "#1A1A1A",
          tertiary: "#2A2A2A",
        },
        light: {
          DEFAULT: "#FFFFFF",
          secondary: "#E5E5E5",
          tertiary: "#B0B0B0",
        },
      },
    },
  },
  plugins: [],
};

export default config;
