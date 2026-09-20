/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          black: '#0B0B0F',
          dark: '#12121A',
          light: '#1E1E2E',
          white: '#F8FAFC', // Light mode background
          canvas: '#07070A',
        },
        station: {
          gray: '#E2E8F0',
          light: '#F1F5F9',
        },
        nebula: {
          purple: '#7C3AED',
          glow: '#8B5CF6',
          deep: '#5B21B6',
          light: '#A78BFA',
        },
        starlight: {
          cyan: '#06B6D4',
          blue: '#3B82F6',
          teal: '#14B8A6',
          sky: '#38BDF8',
        },
        surface: {
          'glass-light': 'rgba(255, 255, 255, 0.70)',
          'glass-dark': 'rgba(18, 18, 26, 0.70)',
          'border-light': 'rgba(226, 232, 240, 0.80)',
          'border-dark': 'rgba(255, 255, 255, 0.10)',
        },
        cyber: {
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

