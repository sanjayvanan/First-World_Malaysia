/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sr-blue': '#0B1120',  // Deep Luxury Blue/Black
        'sr-panel': '#151E32', // Slightly lighter panel color
        'sr-gold': '#C5A059',  // The Gold accent
        'sr-gold-light': '#E5C079',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Ensure you have a clean font
      }
    },
  },
  plugins: [],
}