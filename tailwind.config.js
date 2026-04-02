import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base colors for neumorphism
        light: {
          base: '#e0e5ec',
          shadow: '#a3b1c6',
          highlight: '#ffffff',
        },
        dark: {
          base: '#292d3e',
          shadow: '#1a1c28',
          highlight: '#383e52',
        },
        // Semantic colors
        primary: {
          DEFAULT: '#6366f1',
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        accent: {
          DEFAULT: '#f472b6',
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        success: {
          DEFAULT: '#10b981',
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        warning: {
          DEFAULT: '#f59e0b',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        danger: {
          DEFAULT: '#ef4444',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      boxShadow: {
        // Neumorphic shadows - Light mode
        'neo-light': '6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff',
        'neo-light-sm': '3px 3px 6px #a3b1c6, -3px -3px 6px #ffffff',
        'neo-light-lg': '10px 10px 20px #a3b1c6, -10px -10px 20px #ffffff',
        'neo-light-xl': '15px 15px 30px #a3b1c6, -15px -15px 30px #ffffff',
        // Inner shadow light
        'neo-light-inset': 'inset 4px 4px 8px #a3b1c6, inset -4px -4px 8px #ffffff',
        'neo-light-inset-sm': 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff',
        // Neumorphic shadows - Dark mode
        'neo-dark': '6px 6px 12px #1a1c28, -6px -6px 12px #383e52',
        'neo-dark-sm': '3px 3px 6px #1a1c28, -3px -3px 6px #383e52',
        'neo-dark-lg': '10px 10px 20px #1a1c28, -10px -10px 20px #383e52',
        'neo-dark-xl': '15px 15px 30px #1a1c28, -15px -15px 30px #383e52',
        // Inner shadow dark
        'neo-dark-inset': 'inset 4px 4px 8px #1a1c28, inset -4px -4px 8px #383e52',
        'neo-dark-inset-sm': 'inset 2px 2px 4px #1a1c28, inset -2px -2px 4px #383e52',
        // Colored shadows for buttons
        'neo-primary': '4px 4px 8px rgba(99, 102, 241, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.1)',
        'neo-primary-dark': '4px 4px 8px rgba(99, 102, 241, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.05)',
        'neo-success': '4px 4px 8px rgba(16, 185, 129, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.1)',
        'neo-success-dark': '4px 4px 8px rgba(16, 185, 129, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.05)',
        'neo-danger': '4px 4px 8px rgba(239, 68, 68, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.1)',
        'neo-danger-dark': '4px 4px 8px rgba(239, 68, 68, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.05)',
        'neo-warning': '4px 4px 8px rgba(245, 158, 11, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.1)',
        'neo-warning-dark': '4px 4px 8px rgba(245, 158, 11, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.05)',
        'neo-accent': '4px 4px 8px rgba(244, 114, 182, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.1)',
        'neo-accent-dark': '4px 4px 8px rgba(244, 114, 182, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.05)',
      },
      borderRadius: {
        'neo-sm': '8px',
        'neo': '16px',
        'neo-lg': '20px',
        'neo-xl': '24px',
        'neo-2xl': '32px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
