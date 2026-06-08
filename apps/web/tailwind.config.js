/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Existing colors (preserved for other pages)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#3E2723",
          foreground: "#D7CCC8",
        },
        secondary: {
          DEFAULT: "#D7CCC8",
          foreground: "#3E2723",
        },
        accent: {
          DEFAULT: "#8D6E63",
          foreground: "#ffffff",
        },
        "background-light": "#FAF9F7",
        "background-dark": "#1c1716",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Material Design 3 tokens (new redesign)
        "on-surface": "#1a1c1c",
        "inverse-primary": "#e5beb5",
        "on-error": "#ffffff",
        "on-secondary-fixed": "#2b160f",
        "on-error-container": "#93000a",
        "tertiary-fixed-dim": "#cfc4c0",
        "surface-variant": "#e2e2e2",
        "tertiary": "#292421",
        "secondary-fixed": "#ffdbce",
        "on-secondary-fixed-variant": "#5b4137",
        "secondary-fixed-dim": "#e4beb2",
        "surface-container-highest": "#e2e2e2",
        "on-background": "#1a1c1c",
        "surface-dim": "#dadada",
        "surface-container": "#eeeeee",
        "on-primary-fixed": "#2b1611",
        "outline": "#827471",
        "inverse-surface": "#2f3131",
        "tertiary-fixed": "#ece0dc",
        "on-tertiary-fixed": "#201a18",
        "on-secondary": "#ffffff",
        "surface-container-high": "#e8e8e8",
        "secondary-container": "#fed7ca",
        "surface-bright": "#f9f9f9",
        "inverse-on-surface": "#f0f1f1",
        "primary-fixed-dim": "#e5beb5",
        "on-primary": "#ffffff",
        "on-tertiary": "#ffffff",
        "primary-fixed": "#ffdad2",
        "error-container": "#ffdad6",
        "surface-container-low": "#f3f3f3",
        "outline-variant": "#d4c3bf",
        "on-primary-container": "#c19c94",
        "on-tertiary-container": "#aca29f",
        "on-secondary-container": "#795c51",
        "on-primary-fixed-variant": "#5c403a",
        "surface": "#f9f9f9",
        "surface-tint": "#755750",
        "error": "#ba1a1a",
        "tertiary-container": "#403936",
        "on-surface-variant": "#504442",
        "surface-container-lowest": "#ffffff",
        "primary-container": "#4e342e",
        "on-tertiary-fixed-variant": "#4c4542",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "3rem",
      },
      spacing: {
        "container-max-width": "1200px",
        "margin-desktop": "40px",
        "margin-mobile": "16px",
        "section-gap": "80px",
        "gutter": "24px",
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        "headline": ['Playfair Display', 'serif'],
        "body-font": ['Inter', 'sans-serif'],
      },
      fontSize: {
        "headline-xl": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeInScale: {
          "0%": { opacity: "0", transform: "scale(0.95) translateY(20px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "enter": "fadeInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
}
