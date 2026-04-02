-- ===========================================
-- DIAGNÓSTICO Y FIX PARA BUCKET DE AVATARES
-- Ejecuta TODO este script en el SQL Editor de Supabase
-- ===========================================

-- ===========================================
-- PASO 1: VERIFICAR QUÉ BUCKETS EXISTEN
-- ===========================================
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
ORDER BY id;

-- ===========================================
-- PASO 2: VERIFICAR POLÍTICAS ACTUALES DEL BUCKET AVATARS
-- ===========================================
SELECT policyname, cmd, permissive, roles
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE '%avatar%'
ORDER BY policyname;

-- ===========================================
-- PASO 3: ELIMINAR POLÍTICAS VIEJAS DE AVATARES (si existen)
-- ===========================================
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Authenticated Access" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Public Access" ON storage.objects;

-- ===========================================
-- PASO 4: CREAR BUCKET DE AVATARES (si no existe)
-- ===========================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  false,  -- PRIVADO - se necesitan signed URLs
  5242880, -- 5MB max
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

-- ===========================================
-- PASO 5: CREAR POLÍTICAS CORRECTAS PARA AVATARES
-- ===========================================

-- POLÍTICA 1: INSERT - Los usuarios pueden subir SU PROPIO avatar
CREATE POLICY "Avatar Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- POLÍTICA 2: SELECT - Los usuarios pueden ver SU PROPIO avatar
CREATE POLICY "Avatar Select"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- POLÍTICA 3: UPDATE - Los usuarios pueden actualizar SU PROPIO avatar
CREATE POLICY "Avatar Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- POLÍTICA 4: DELETE - Los usuarios pueden eliminar SU PROPIO avatar
CREATE POLICY "Avatar Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ===========================================
-- PASO 6: VERIFICAR QUE LAS POLÍTICAS SE CREARON CORRECTAMENTE
-- ===========================================
SELECT policyname, cmd, permissive, roles
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE '%Avatar%'
ORDER BY policyname;

-- ===========================================
-- INSTRUCCIONES:
-- 1. Copia TODO este script
-- 2. Ve a Supabase → SQL Editor
-- 3. Pega el script y ejecútalo
-- 4. Verifica que no haya errores en la consola
-- 5. Deberías ver el bucket 'avatars' en los resultados del PASO 1
-- 6. Deberías ver las 4 políticas en los resultados del PASO 6:
--    - Avatar Upload
--    - Avatar Select
--    - Avatar Update
--    - Avatar Delete
-- ===========================================
