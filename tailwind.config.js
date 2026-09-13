/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#050B14',
          900: '#07111F',
          800: '#0B1624',
          700: '#101C2B',
          600: '#142235',
          500: '#1A2C42',
        },
        green: {
          neon: '#39FF88',
          bright: '#20E878',
          mid: '#00D97E',
        },
        cyan: { neon: '#00CFFF' },
        slate: {
          border: '#1E3048',
          muted: '#2A4060',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
