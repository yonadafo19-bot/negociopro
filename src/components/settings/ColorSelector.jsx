import { Card, CardHeader, CardTitle, CardContent } from '../common'
import { useColor } from '../../context/ColorContext'
import { Palette, Check } from 'lucide-react'

const ColorSelector = () => {
  const {
    paletteId,
    gradientId,
    setPalette,
    setGradient,
    allPalettes,
    allGradients,
    currentPalette,
    currentGradient,
  } = useColor()

  return (
    <div className="space-y-6">
      {/* Selector de Color Principal */}
      <Card padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <Palette className="h-5 w-5" />
            Color Principal
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Selecciona el color principal de la aplicación
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {allPalettes.map((palette) => (
              <button
                key={palette.id}
                onClick={() => setPalette(palette.id)}
                className={`relative group p-4 rounded-neo-lg transition-all duration-300 ${
                  paletteId === palette.id
                    ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-gray-400 dark:ring-gray-600 scale-105'
                    : 'hover:scale-105'
                }`}
                style={{
                  backgroundColor: palette.primary,
                }}
                title={palette.name}
              >
                <span className="text-xs font-medium text-gray-800 dark:text-gray-200 drop-shadow-md">
                  {palette.name.split(' ')[0]}
                </span>

                {paletteId === palette.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                )}

                <div className="absolute inset-0 rounded-neo-lg bg-gradient-to-br from-black/10 to-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </button>
            ))}
          </div>

          {/* Preview del color seleccionado */}
          <div className="mt-6 p-4 rounded-neo-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color actual: <span className="font-semibold">{currentPalette.name}</span>
            </p>
            <div className="flex gap-2">
              <div
                className="w-12 h-12 rounded-neo shadow-neo-sm"
                style={{ backgroundColor: currentPalette.primary }}
              />
              <div
                className="w-12 h-12 rounded-neo shadow-neo-sm bg-gradient-to-br"
                style={{
                  backgroundImage: `linear-gradient(to right, ${currentPalette.primaryLight}, ${currentPalette.primaryDark})`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selector de Gradientes */}
      <Card padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
            🎨 Gradientes Especiales
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Gradientes para elementos destacados
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allGradients.map((gradient) => (
              <button
                key={gradient.id}
                onClick={() => setGradient(gradient.id)}
                className={`relative p-4 rounded-neo-lg transition-all duration-300 ${
                  gradientId === gradient.id
                    ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-gray-400 dark:ring-gray-600 scale-105'
                    : 'hover:scale-105'
                }`}
              >
                <div
                  className={`w-full h-16 rounded-neo shadow-neo-sm bg-gradient-to-br ${gradient.class}`}
                />

                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-2 text-center">
                  {gradient.name}
                </p>

                {gradientId === gradient.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Preview del gradiente */}
          <div className="mt-6 p-4 rounded-neo-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gradiente actual: <span className="font-semibold">{currentGradient.name}</span>
            </p>
            <div
              className={`w-full h-16 rounded-neo shadow-neo-sm bg-gradient-to-br ${currentGradient.class}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview General */}
      <Card padding="lg">
        <CardHeader>
          <CardTitle>📱 Vista Previa</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Botón primario */}
            <button
              className="w-full px-6 py-3 rounded-neo-lg bg-gradient-to-br text-white font-semibold shadow-neo-primary dark:shadow-neo-primary-dark hover:scale-[1.02] active:scale-[0.98] transition-all"
              style={{
                backgroundImage: `linear-gradient(to right, ${currentPalette.primaryLight}, ${currentPalette.primaryDark})`,
              }}
            >
              Botón Primario
            </button>

            {/* Badge */}
            <div className="flex gap-3">
              <span
                className="px-4 py-2 rounded-neo text-sm font-medium shadow-neo-sm text-gray-800 dark:text-gray-200"
                style={{ backgroundColor: currentPalette.primary }}
              >
                Badge
              </span>

              <span
                className={`px-4 py-2 rounded-neo text-sm font-medium shadow-neo-sm text-white bg-gradient-to-br ${currentGradient.class}`}
              >
                Gradiente
              </span>
            </div>

            {/* Icon button */}
            <div className="flex gap-3">
              <button
                className="w-12 h-12 rounded-neo flex items-center justify-center shadow-neo hover:shadow-neo-lg transition-all"
                style={{
                  backgroundColor: currentPalette.primary,
                }}
              >
                ⭐
              </button>
              <button
                className={`w-12 h-12 rounded-neo flex items-center justify-center text-white shadow-neo hover:shadow-neo-lg transition-all bg-gradient-to-br ${currentGradient.class}`}
              >
                🎨
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ColorSelector
