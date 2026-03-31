# Configuración de Supabase Storage para Imágenes

## 📸 Crear Bucket para Imágenes de Productos

### Paso 1: Ir a Supabase

1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. En el menú lateral, haz clic en **"Storage"**

### Paso 2: Crear Bucket

1. Clic en **"New bucket"**
2. Configura:
   ```
   Name: product-images
   Public bucket: ✅ MARCAR (para que las imágenes sean públicas)
   }
   File size limit: 5 MB
   Allowed MIME types: image/png, image/jpeg, image/gif, image/webp

### Paso 3: Configurar Políticas (RLS)

El bucket ya debe ser público, pero verifica:

1. Ve a **"Policies"** dentro de Storage
2. Asegúrate de que haya una política como:
   ```sql
   -- Permitir lectura pública
   CREATE POLICY "Public Access"
   ON "storage"."objects"
   FOR SELECT
   USING (true);
   ```

### Paso 4: Verificar que funciona

En tu app:
1. Ve a **Inventario**
2. Clic en **"Nuevo Producto"**
3. En la sección de imagen, clic en el área de upload
4. Selecciona una imagen
5. Espera a que suba
6. Deberías ver el preview de la imagen

### URLs de las imágenes:

Las imágenes se guardarán así:
```
https://tu-proyecto.supabase.co/storage/v1/object/public/product-images/1234567890.png
```

## 🗑️ Eliminar imágenes (opcional)

Si necesitas limpiar imágenes viejas:
1. Ve a Storage en Supabase Dashboard
2. Busca en la carpeta `product-images`
3. Selecciona las imágenes
4. Clic en "Delete"

## 🎨 Recomendaciones

- **Formatos preferidos:** JPG/WebP (mejor compresión)
- **Tamaño máximo:** 5MB (ya está configurado)
- **Nombres:** Se generan automáticamente con timestamp
- **Backups:** Supabase tiene backups automáticos

---

**¡LISTO!** 📸✨

Ahora tus productos pueden tener fotos reales y lindas.
