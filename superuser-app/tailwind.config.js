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
          blue: '#041E42',      // Deep Royal Blue
          panel: '#0B254A',     // Panel Background
          gold: '#C5A059',      // The Gold
          green: '#2ECC71',     // Money Green
          silver: '#BDC3C7',    // Silver Badge
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'blue-gradient': 'linear-gradient(180deg, #041E42 0%, #000000 100%)',
      }
    },
  },
  plugins: [],
}