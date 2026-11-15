// Silver-blue "steel" scale replacing the old violet/indigo accents.
const STEEL = {
  50: '#F4F6FA', 100: '#E6EAF0', 200: '#CDD4DE', 300: '#B2BCC9', 400: '#97A3B3',
  500: '#7D8899', 600: '#646F80', 700: '#4D5767', 800: '#373F4C', 900: '#222B39', 950: '#141A25',
};

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
        // Legacy token names, remapped to the "Intelligence Core" palette so
        // every existing section picks up the new theme without rewrites.
        space: {
          black: '#080B12', // obsidian
          dark: '#0B0F17',
          light: '#151B26',
          white: '#F4F6FA',
          canvas: '#06080D',
        },
        station: {
          gray: '#222B39',
          light: '#151B26',
        },
        // former violet accent -> chrome silver family
        nebula: {
          purple: '#AEB8C6',
          glow: '#C9D1DB',
          deep: '#7D8899',
          light: '#DDE3EA',
        },
        // former cyan/blue accent -> icy blue family
        starlight: {
          cyan: '#8ABFFF',
          blue: '#6EA8F0',
          teal: '#8ABFFF',
          sky: '#B5D5FF',
        },
        surface: {
          'glass-light': 'rgba(255, 255, 255, 0.04)',
          'glass-dark': 'rgba(11, 15, 23, 0.70)',
          'border-light': 'rgba(255, 255, 255, 0.08)',
          'border-dark': 'rgba(255, 255, 255, 0.08)',
        },
        // raw Tailwind scales used across sections, retuned to the palette
        cyan: {
          50: '#F1F7FF', 100: '#E1EEFF', 200: '#C7E0FF', 300: '#A9CFFF', 400: '#8ABFFF',
          500: '#6EA8F0', 600: '#5590DB', 700: '#4277BF', 800: '#335E99', 900: '#284A78', 950: '#1A3050',
        },
        purple: STEEL,
        violet: STEEL,
        indigo: STEEL,
        fuchsia: STEEL,
        // "Intelligence Core" palette
        core: {
          obsidian: '#080B12',
          graphite: '#222B39',
          chrome: '#C9D1DB',
          icy: '#8ABFFF',
          ink: '#F4F6FA',
          mist: '#929EAF',
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

