/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0b0f19',      // Rich dark background
          card: '#151c2c',    // Deep card color
          cardLight: '#1f293d',
          border: '#1f293d',  // Subtle border color
          text: '#f8fafc',
          textMuted: '#94a3b8',
          accent: '#3b82f6',  // Vivid blue
          accentHover: '#2563eb',
          profit: '#10b981',  // Emerald green
          loss: '#f43f5e',    // Rose red
          warning: '#f59e0b'  // Amber
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.15)',
        'glow-profit': '0 0 20px rgba(16, 185, 129, 0.15)',
        'glow-loss': '0 0 20px rgba(244, 63, 94, 0.15)',
      }
    },
  },
  plugins: [],
}
