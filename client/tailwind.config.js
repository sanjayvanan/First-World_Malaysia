/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
      colors: {
        sr: {
          blue: '#041E42',      // Deep Royal Blue (Background)
          panel: '#0B254A',     // Slightly lighter (Cards/Sidebar)
          gold: '#C5A059',      // The Gold Border/Text
          green: '#2ECC71',     // The Money Green
          silver: '#BDC3C7',    // Silver Badge
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(180deg, #F3E5AB 0%, #C5A059 100%)',
        'silver-gradient': 'linear-gradient(180deg, #F0F3F4 0%, #BDC3C7 100%)',
        'blue-gradient': 'linear-gradient(180deg, #041E42 0%, #000000 100%)',
      }
    },
  },
  plugins: [],
}