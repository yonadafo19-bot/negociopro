/**
 * Design System - NegociPro
 * Sistema Neumórfico Profesional con Modo Día/Noche
 * WCAG AA Contrast Compliant - CONTRASTE MEJORADO EN MODO OSCURO
 */

// ============================================
// COLORES - Neumorphic Light Mode
// ============================================
export const colors = {
  // Light Mode Colors
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
  // Dark Mode Colors - CONTRASTE MEJORADO
  dark: {
    bg: '#1a1a2e',
    'bg-alt': '#1e1e35',
    surface: '#252538',
    'surface-alt': '#2a2a42',
    text: '#f1f5f9', // Blanco puro para máximo contraste
    'text-muted': '#a5b4fc', // Azul claro para mejor contraste
    'text-light': '#94a3b8', // Gris medio
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
}

// ============================================
// SOMBRAS Neumórficas
// ============================================
export const shadows = {
  // Light mode shadows - suaves con brillo
  'neo-sm': '0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(255, 255, 255, 0.8)',
  'neo': '0 4px 6px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(255, 255, 255, 0.8)',
  'neo-lg': '0 10px 15px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(255, 255, 255, 0.8)',
  'neo-xl': '0 20px 25px rgba(0, 0, 0, 0.08), 0 10px 10px rgba(255, 255, 255, 0.8)',
  // Inner shadow para estados presionados
  'inner-shadow': 'inset 2px 4px 6px rgba(0, 0, 0, 0.06)',
  'inner-shadow-lg': 'inset 4px 6px 10px rgba(0, 0, 0, 0.08)',
  // Sombras estándar
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.06)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.06)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 12px 25px -6px rgba(0, 0, 0, 0.1)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
}

// ============================================
// BORDER RADIUS - Neumórfico
// ============================================
export const borderRadius = {
  'neo-sm': '0.5rem',
  'neo': '0.75rem',
  'neo-lg': '1rem',
  'neo-xl': '1.25rem',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
}

// ============================================
// SPACING - Scale consistente
// ============================================
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem',
}

// ============================================
// TYPOGRAPHY - Escalas de fuente
// ============================================
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
    mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
}

// ============================================
// Z-INDEX - Capas consistentes
// ============================================
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,
}

// ============================================
// TRANSITIONS - Animaciones suaves
// ============================================
export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  easing: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
}

// ============================================
// BREAKPOINTS - Responsive design
// ============================================
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

// ============================================
// COMPONENT SPECIFIC
// ============================================
export const components = {
  button: {
    height: {
      sm: '2.5rem',
      md: '3rem',
      lg: '3.5rem',
      xl: '4rem',
    },
    padding: {
      sm: '0.5rem 1rem',
      md: '0.75rem 1.5rem',
      lg: '1rem 2rem',
    },
    fontSize: {
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
    },
  },
  input: {
    height: {
      sm: '2.5rem',
      md: '3rem',
      lg: '3.5rem',
    },
    padding: {
      sm: '0.5rem 0.75rem',
      md: '0.75rem 1rem',
      lg: '1rem 1.25rem',
    },
    fontSize: {
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
    },
  },
  card: {
    padding: {
      none: '0',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '2.5rem',
    },
  },
  modal: {
    width: {
      sm: '90%',
      md: '600px',
      lg: '800px',
      xl: '1000px',
      full: '100%',
    },
    maxWidth: {
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem',
      full: '100%',
    },
  },
}

// ============================================
// THEME COMPLETE EXPORT
// ============================================
export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  zIndex,
  transitions,
  breakpoints,
  components,
}

export default theme
