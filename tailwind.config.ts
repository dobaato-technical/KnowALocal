import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#f8f1dd", // global background
        surface: "#bcd2c2", // cards / sections
        primary: "#335358", // header / main buttons
        secondary: "#69836a", // secondary buttons / badges
        accent: "#d69850", // highlights / CTA hover
        dark: "#774738", // footer / depth
      },

      fontFamily: {
        heading: ["var(--ff-heading)", "serif"], // Intro Rust
        body: ["var(--ff-body)", "serif"], // Romman
      },

      scale: {
        105: "1.05", // button hover scale
      },
    },
  },
  plugins: [],
} satisfies Config;
