import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['var(--font-pixel)', '"Press Start 2P"', 'monospace'],
        mono: ['"Courier New"', 'Consolas', 'monospace'],
      },
      borderRadius: {
        lg: '0px',
        md: '0px',
        sm: '0px',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        neon: {
          green: '#39ff14',
          cyan: '#00fff7',
          magenta: '#ff2d95',
          yellow: '#ffe600',
          red: '#ff0000',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      boxShadow: {
        'pixel': '4px 4px 0px #000',
        'pixel-sm': '2px 2px 0px #000',
        'pixel-green': '4px 4px 0px #006600',
        'pixel-magenta': '4px 4px 0px #660033',
        'pixel-cyan': '4px 4px 0px #006666',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'crt-flicker': 'crt-flicker 0.15s infinite',
        'pixel-pulse': 'pixel-pulse 2s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        'crt-flicker': {
          '0%': { opacity: '0.97' },
          '5%': { opacity: '1' },
          '10%': { opacity: '0.98' },
          '15%': { opacity: '1' },
          '100%': { opacity: '1' },
        },
        'pixel-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
