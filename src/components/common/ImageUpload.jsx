import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { supabase } from '../../services/supabase'

const ImageUpload = ({ imageUrl, onUpload, onRemove, bucket = 'product-images' }) => {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(imageUrl)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida')
      return
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no puede superar 5MB')
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
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (uploadError) {
        // Si el bucket no existe, intentamos crearlo
        if (uploadError.message.includes('The resource was not found')) {
          // Bucket no existe - usamos URL temporal
          const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath)

          onUpload(publicUrlData.publicUrl)
          setUploading(false)
          return
        }
        throw uploadError
      }

      // Obtener URL pública
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

      onUpload(data.publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error al subir la imagen. Intenta de nuevo.')
      setPreview(imageUrl)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onRemove()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-neo-border dark:border-dark-border"
          />
          <button
            onClick={handleRemove}
            disabled={uploading}
            className="absolute top-2 right-2 p-2 bg-neo-danger dark:bg-dark-danger text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
            aria-label="Eliminar imagen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-neo-border dark:border-dark-border rounded-lg p-8 text-center cursor-pointer hover:border-neo-primary dark:hover:border-dark-primary transition-colors"
        >
          {uploading ? (
            <Loader2 className="h-12 w-12 text-neo-primary dark:text-dark-primary mx-auto animate-spin" />
          ) : (
            <>
              <ImageIcon className="h-12 w-12 text-neo-text-muted dark:text-dark-text-muted mx-auto mb-2" />
              <p className="text-neo-text dark:text-dark-text font-medium mb-1">
                Subir imagen
              </p>
              <p className="text-sm text-neo-text-muted dark:text-dark-text-muted">
                Click o arrastra una imagen aquí
              </p>
              <p className="text-xs text-neo-text-muted dark:text-dark-text-muted mt-1">
                JPG, PNG o GIF (max 5MB)
              </p>
            </>
          )}
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
