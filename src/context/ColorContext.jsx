import { createContext, useContext, useState, useEffect } from 'react'
import { colorPalettes, getPaletteById, specialGradients, getGradientById } from '../theme/colorPalettes'

const ColorContext = createContext()

export const useColor = () => {
  const context = useContext(ColorContext)
  if (!context) {
    throw new Error('useColor must be used within ColorProvider')
  }
  return context
}

export const ColorProvider = ({ children }) => {
  // Cargar preferencia guardada
  const [paletteId, setPaletteId] = useState(() => {
    const saved = localStorage.getItem('colorPalette')
    return saved || 'blue'
  })

  const [gradientId, setGradientId] = useState(() => {
    const saved = localStorage.getItem('colorGradient')
    return saved || 'ocean'
  })

  const currentPalette = getPaletteById(paletteId)
  const currentGradient = getGradientById(gradientId)

  // Aplicar colores al documento
  useEffect(() => {
    const root = document.documentElement

    // Variables CSS para el color primario
    root.style.setProperty('--color-primary', currentPalette.primary)
    root.style.setProperty('--color-primary-light', currentPalette.primaryLight)
    root.style.setProperty('--color-primary-dark', currentPalette.primaryDark)

    // Guardar en localStorage
    localStorage.setItem('colorPalette', paletteId)
  }, [paletteId, currentPalette])

  useEffect(() => {
    localStorage.setItem('colorGradient', gradientId)
  }, [gradientId])

  const value = {
    // Estado
    paletteId,
    gradientId,

    // Datos actuales
    currentPalette,
    currentGradient,
    allPalettes: colorPalettes,
    allGradients: specialGradients,

    // Acciones
    setPalette: (id) => setPaletteId(id),
    setGradient: (id) => setGradientId(id),

    // Clases de utilidad
    primaryBg: currentPalette.bg,
    primaryBgDark: currentPalette.bgDark,
    primaryText: currentPalette.text,
    primaryTextDark: currentPalette.textDark,
    primaryBorder: currentPalette.border,
    primaryBorderDark: currentPalette.borderDark,
    primaryGradient: currentPalette.gradient,
    primaryGradientDark: currentPalette.gradientDark,
  }

  return <ColorContext.Provider value={value}>{children}</ColorContext.Provider>
}

export default ColorContext
