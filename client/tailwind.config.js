/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // WORLD 1: Sai Ram (Spiritual / Landing)
        sairam: {
          beige: '#F5F0E6',    // The background cream color
          gold: '#D4AF37',     // The accent gold
          text: '#4A4A4A',     // Dark gray text
          brown: '#8B4513',    // Earthy tones
        },
        
        // WORLD 2: Maxso (Tech / Dashboard)
        maxso: {
          dark: '#0F172A',     // Deep blue/black background
          card: '#1E293B',     // Lighter card background
          glow: '#7C3AED',     // Purple neon glow
          accent: '#38BDF8',   // Blue accent
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'], // For Sai Ram
        sans: ['Inter', 'sans-serif'],    // For Maxso
      }
    },
  },
  plugins: [],
}