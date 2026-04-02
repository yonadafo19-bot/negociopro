import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../context/AuthContext'

const ImageUpload = ({ imageUrl, onUpload, onRemove, bucket = 'product-images' }) => {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(imageUrl)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida (JPG, PNG, GIF)')
      return
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar 5MB')
      return
    }

    // Para avatares, verificar que el usuario esté autenticado
    if (bucket === 'avatars' && !user) {
      setError('Debes estar autenticado para subir una imagen de perfil')
      return
    }

    setUploading(true)

    try {
      // Crear preview local
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Subir a Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

      // Para avatares, guardar en carpeta del usuario
      const filePath = bucket === 'avatars' && user
        ? `${user.id}/${fileName}`
        : fileName

      // Intentar subir la imagen
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)

        // Si el bucket no existe, mostrar error informativo
        if (uploadError.message.includes('The resource was not found') ||
            uploadError.message.includes('Bucket not found')) {
          setError(`El bucket "${bucket}" no existe en Supabase Storage. Ve a supabase.com/storage y crea el bucket con las políticas correctas.`)
          setPreview(null)
          setUploading(false)
          return
        }

        throw uploadError
      }

      // Obtener URL firmada (para buckets privados) o pública (para buckets públicos)
      let url
      if (bucket === 'avatars') {
        // Para avatares (bucket privado), crear signed URL
        const { data: signedData } = await supabase.storage
          .from(bucket)
          .createSignedUrl(filePath, 31536000) // 1 año de validez
        url = signedData.signedUrl
      } else {
        // Para product-images, usar URL pública
        const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath)
        url = publicData.publicUrl
      }

      // Notificar al componente padre
      if (onUpload) {
        onUpload(url)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setError(`Error al subir: ${error.message || 'Error desconocido'}`)
      setPreview(imageUrl)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setError(null)
    if (onRemove) {
      onRemove()
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative group">
          <div className="card-neo overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-56 object-cover"
            />
          </div>
          <button
            onClick={handleRemove}
            disabled={uploading}
            className="absolute top-3 right-3 icon-btn-neo bg-white dark:bg-gray-800 shadow-lg"
            aria-label="Eliminar imagen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="card-neo-inset p-8 text-center cursor-pointer hover:-translate-y-1 transition-transform duration-200"
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-primary-500 dark:text-primary-400 animate-spin mb-3" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">Subiendo imagen...</p>
            </div>
          ) : (
            <>
              <div className="icon-btn-neo-lg mx-auto mb-4">
                <ImageIcon className="h-8 w-8" />
              </div>
              <p className="text-gray-800 dark:text-gray-100 font-semibold mb-1">
                Subir imagen
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Click o arrastra una imagen aquí
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                JPG, PNG o GIF (máx 5MB)
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-neo bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-danger-500 dark:text-danger-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-danger-700 dark:text-danger-300">{error}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
        aria-label="Seleccionar imagen"
      />
    </div>
  )
}

export default ImageUpload
