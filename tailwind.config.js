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
        forest: {
          950: '#061c11',
          900: '#0A2F1D',
          800: '#14462B',
          700: '#1E5C39',
          600: '#2A7249',
          500: '#398D5B',
          100: '#E8F5EE',
        },
        moss: {
          DEFAULT: '#1E4620',
          light: '#2E5A30',
        },
        sage: {
          DEFAULT: '#4A5D4E',
          light: '#728876',
        },
        wood: {
          900: '#2E1E12',
          800: '#4A3B32',
          700: '#634F42',
          600: '#7E6656',
          500: '#8C6239',
          400: '#AC8259',
          300: '#C5A37D',
          200: '#DFCDA2',
        },
        luxury: {
          gold: '#D4AF37',
          beige: '#F7F4EB',
          warmwhite: '#FAF8F5',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
