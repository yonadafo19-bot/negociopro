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
        // Neumorphic Light Mode Colors
        neo: {
          bg: '#e0e5ec',
          'bg-alt': '#f4f6fa',
          surface: '#ffffff',
          'surface-alt': '#f8f9fc',
          text: '#1e293b',
          'text-muted': '#64748b',
          'text-light': '#94a3b8',
          border: '#e2e8f0',
          primary: '#6366f1',
          'primary-light': '#818cf8',
          accent: '#f472b6',
          'accent-light': '#fb7185',
          success: '#10b981',
          'success-light': '#34d399',
          warning: '#f59e0b',
          'warning-light': '#fbbf24',
          danger: '#ef4444',
          'danger-light': '#fca5a5',
        },
        // Neumorphic Dark Mode Colors - CONTRASTE MEJORADO
        dark: {
          bg: '#1a1a2e',
          'bg-alt': '#1e1e35',
          surface: '#252538',
          'surface-alt': '#2a2a42',
          text: '#f1f5f9', // Blanco puro para máximo contraste
          'text-muted': '#a5b4fc', // Azul claro mejorado
          'text-light': '#64748b', // Gris medio
          border: '#3f3f52',
          primary: '#818cf8', // Azul brillante para mejor contraste
          'primary-light': '#a5b4fc',
          accent: '#fb923c',
          'accent-light': '#fdba74',
          success: '#22c55e',
          'success-light': '#4ade80',
          warning: '#f59e0b',
          'warning-light': '#fbbf24',
          danger: '#f87171',
          'danger-light': '#fca5a5',
        },
      },
      boxShadow: {
        // Neumorphic shadows - soft, with depth
        'neo-sm': '0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(255, 255, 255, 0.8)',
        'neo': '0 4px 6px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(255, 255, 255, 0.8)',
        'neo-lg': '0 10px 15px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(255, 255, 255, 0.8)',
        'neo-xl': '0 20px 25px rgba(0, 0, 0, 0.08), 0 10px 10px rgba(255, 255, 255, 0.8)',
        // Inner shadow for pressed states
        'inner-shadow': 'inset 2px 4px 6px rgba(0, 0, 0, 0.06)',
        'inner-shadow-lg': 'inset 4px 6px 10px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'neo-sm': '0.5rem',
        'neo': '0.75rem',
        'neo-lg': '1rem',
        'neo-xl': '1.25rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
