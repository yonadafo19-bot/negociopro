# Instrucciones para configurar Supabase Storage

## Buckets necesarios

### 1. Bucket "product-images"
Este bucket se usa para almacenar las imágenes de los productos.

**Pasos:**
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. En el menú lateral, haz clic en **Storage**
4. Haz clic en **"New bucket"**
5. Nombre: `product-images`
6. Public bucket: **NO** (opcional, pero más seguro)
7. Haz clic en **"Create bucket"**

**Políticas (Policies):**
Después de crear el bucket, ve a la pestaña **Policies** del bucket y agrega:

1. **Policy para ver imágenes (SELECT):**
   - Name: `Allow public image viewing`
   - Allowed operation: `SELECT`
   - Target role: `authenticated` (o `anon` si quieres público)
   - USING expression: `true`

2. **Policy para subir imágenes (INSERT):**
   - Name: `Allow authenticated upload`
   - Allowed operation: `INSERT`
   - Target role: `authenticated`
   - USING expression: `auth.uid()::text = (storage.foldername(name))[1]`

### 2. Bucket "avatars"
Este bucket se usa para las fotos de perfil de los usuarios.

**Pasos:**
1. En la misma página de **Storage**
2. Haz clic en **"New bucket"**
3. Nombre: `avatars`
4. Public bucket: **NO**
5. Haz clic en **"Create bucket"**

**Políticas (Policies):**
1. **Policy para ver avatares (SELECT):**
   - Name: `Allow authenticated avatar viewing`
   - Allowed operation: `SELECT`
   - Target role: `authenticated`
   - USING expression: `true`

2. **Policy para subir avatares (INSERT):**
   - Name: `Allow users to upload their avatar`
   - Allowed operation: `INSERT`
   - Target role: `authenticated`
   - USING expression: `auth.uid()::text = (storage.foldername(name))[1]`

3. **Policy para eliminar avatares (DELETE):**
   - Name: `Allow users to delete their avatar`
   - Allowed operation: `DELETE`
   - Target role: `authenticated`
   - USING expression: `auth.uid()::text = (storage.foldername(name))[1]`

---

## Ejecutar el SQL completo

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. En el menú lateral, haz clic en **SQL Editor**
4. Crea un nuevo query
5. Copia el contenido del archivo `supabase-setup.sql`
6. Pégalo en el editor
7. Haz clic en **"Run"** o presiona `Ctrl+Enter`

---

## Verificar que todo esté funcionando

Después de ejecutar el SQL y crear los buckets:

1. **Verificar tablas:**
   - En Supabase, ve a **Table Editor**
   - Deberías ver: `notifications`, `catalogs`, `catalog_products`

2. **Verificar buckets:**
   - En Supabase, ve a **Storage**
   - Deberías ver: `product-images`, `avatars`

3. **Probar la aplicación:**
   - Intenta crear un catálogo
   - Intenta subir una imagen de producto
   - Intenta cambiar tu foto de perfil

---

## Solución de problemas

### Error: "The resource was not found"
Este error significa que el bucket no existe. Sigue las instrucciones de arriba para crearlo.

### Error: "Bucket not found"
Mismo error anterior. Crea el bucket faltante.

### Error: "relation 'notifications' does not exist"
Ejecuta el archivo SQL completo `supabase-setup.sql` en el SQL Editor.

### Error: "relation 'catalogs' does not exist"
Mismo solución anterior. Ejecuta el SQL completo.

### Las políticas de Storage no funcionan
Asegúrate de:
1. Haber creado las políticas con el rol correcto (`authenticated` o `anon`)
2. Las expresiones USING estén correctas
3. El bucket esté configurado apropiadamente (público o privado)

---

## Notas importantes

- **Carpetas en buckets:** Las imágenes se guardarán con nombres aleatorios en la raíz del bucket
- **Tamaño máximo:** El componente ImageUpload limita a 5MB por imagen
- **Formatos soportados:** JPG, PNG, GIF
- **URLs públicas:** Se generan automáticamente usando `getPublicUrl()`
