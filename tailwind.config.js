/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#111111',
        surface: {
          light: '#2A2A2A',
          DEFAULT: '#1E1E1E',
          dark: '#161616'
        },
        brand: {
          light: '#F8B195',
          DEFAULT: '#E68A5C',
          dark: '#B05934'
        },
        text: {
          primary: '#EEEEEE',
          secondary: '#A0A0A0',
          muted: '#666666'
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444'
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
