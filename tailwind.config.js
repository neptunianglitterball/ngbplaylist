/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'draw-circle': 'draw-circle 0.6s ease-out forwards',
      },
      keyframes: {
        'draw-circle': {
          from: { strokeDasharray: '0, 450' },
          to: { strokeDasharray: '450, 450' },
        },
        'crt-flicker': {
          '0%': { opacity: '0.1' },
          '5%': { opacity: '0.15' },
          '10%': { opacity: '0.1' },
          '15%': { opacity: '0.2' },
          '20%': { opacity: '0.15' },
          '25%': { opacity: '0.1' },
          '80%': { opacity: '0.15' },
          '100%': { opacity: '0.12' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
