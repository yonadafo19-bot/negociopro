/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#fef2f2',
          200: '#fee2e2',
          300: '#fecaca',
          400: '#fca5a5',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        }
      },
      fontFamily: {
        sans: ['Quicksand', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'kawaii': '4px 4px 0px 0px rgba(0,0,0,0.1)',
        'kawaii-sm': '2px 2px 0px 0px rgba(0,0,0,0.1)',
        'kawaii-lg': '6px 6px 0px 0px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        'kawaii': '1rem',
        'kawaii-lg': '1.5rem',
        'kawaii-xl': '2rem',
      }
    },
  },
  plugins: [],
}
