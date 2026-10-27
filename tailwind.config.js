/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        'gradient-wave': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.08)' }
        },
        'float-slow': {
          '0%, 100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
          '33%': { transform: 'translate(30px, -20px) rotate(4deg)' },
          '66%': { transform: 'translate(-20px, 20px) rotate(-4deg)' },
        }
      },
      animation: {
        'gradient-wave': 'gradient-wave 12s ease infinite',
        'pulse-slow': 'pulse-slow 8s ease-in-out infinite',
        'float-slow': 'float-slow 16s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
