import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: {
        /* DESIGN TOKENS (Role-based naming)
           Mental model: Think in roles, not hex codes */

        /* Primary: Authority & Structure */
        primary: "#335358" /* Dark Teal */,

        /* Secondary: Support & Hierarchy */
        secondary: "#69836a" /* Sage Green */,

        /* Accent: Attention & Action (5-10% max)
           Only for primary CTAs, hover states, highlights */
        accent: "#d69850" /* Warm Tan */,

        /* Neutrals: Canvas, Surface, Text */
        "neutral-light": "#f8f1dd" /* Light Beige - page bg, breathing room */,
        "neutral-medium":
          "#bcd2c2" /* Muted Green - cards, section bg, inputs */,
        "neutral-dark": "#774738" /* Dark Brown - body text, grounding */,

        /* Legacy aliases for backward compatibility */
        bg: "#f8f1dd",
        surface: "#bcd2c2",
        text: "#774738",
        "text-light": "#999",

        /* Dark mode palette (for future implementation) */
        "dark-bg": "#335358",
        "dark-surface": "#2d2d2d",
        "dark-primary": "#7ba3a8",
        "dark-secondary": "#9cb59e",
        "dark-accent": "#e8b88a",
        "dark-text": "#f5f0e6",
      },
      fontFamily: {
        heading: ["Roboto Slab", "serif"],
        body: ["Romman", "serif"],
      },
      boxShadow: {
        sm: "0 1px 2px rgba(51, 83, 88, 0.05)",
      },
    },
  },
  plugins: [],
} satisfies Config;
