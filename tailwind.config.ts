import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-assistant)", "system-ui", "sans-serif"],
        heading: ["var(--font-heebo)", "var(--font-assistant)", "sans-serif"],
      },
      colors: {
        // Brand teal — extracted from McIntyre Legal. Primary accent.
        primary: {
          DEFAULT: "#27717F",
          light: "#327B87",
          dark: "#1F5563",
        },
        // Deep teal-navy — dark feature sections, footer, sidebar (replaces old near-black).
        dark: {
          DEFAULT: "#153243",
          secondary: "#1B3E4E",
          tertiary: "#2A5563",
        },
        // Text/elements on dark teal surfaces.
        light: {
          DEFAULT: "#FFFFFF",
          secondary: "#DCE6E8",
          tertiary: "#9DB4BA",
        },
        // Warm off-white page surfaces (light-first layout).
        cream: {
          DEFAULT: "#FBFAF7",
          soft: "#F3F1EA",
        },
        // Text on light surfaces.
        ink: {
          DEFAULT: "#153243",
          soft: "#3D5560",
          muted: "#6C828B",
        },
        // Logo gold — brand-continuity accent, used sparingly.
        gold: {
          DEFAULT: "#C9985E",
          light: "#D8AE78",
        },
        line: "#E4E8E7",
        whatsapp: {
          DEFAULT: "#25D366",
          dark: "#1EB258",
          header: "#075E54",
          bubble: "#DCF8C6",
          wall: "#ECE5DD",
          ink: "#0A3D20",
        },
      },
    },
  },
  plugins: [],
};

export default config;
