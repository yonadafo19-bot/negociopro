-- ===========================================
-- FIX PARA TODOS LOS BUCKETS DE STORAGE
-- Ejecutar en Supabase SQL Editor
-- ===========================================

-- ===========================================
-- BUCKET: product-images
-- ===========================================

-- Crear bucket de productos (público)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,   -- PÚBLICO
  5242880, -- 5MB max
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

-- Políticas para product-images (público)
DROP POLICY IF EXISTS "Product Images Upload" ON storage.objects;
DROP POLICY IF EXISTS "Product Images Select" ON storage.objects;
DROP POLICY IF EXISTS "Product Images Update" ON storage.objects;
DROP POLICY IF EXISTS "Product Images Delete" ON storage.objects;

CREATE POLICY "Product Images Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Product Images Select" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'product-images');
CREATE POLICY "Product Images Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images');
CREATE POLICY "Product Images Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images');

-- ===========================================
-- BUCKET: avatars
-- ===========================================

-- Crear bucket de avatares (público por simplicidad)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,   -- PÚBLICO
  5242880, -- 5MB max
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

-- Políticas para avatars
DROP POLICY IF EXISTS "Avatar Upload" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Select" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Update" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Delete" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Public Select" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Public Delete" ON storage.objects;

CREATE POLICY "Avatar Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Avatar Select" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'avatars');
CREATE POLICY "Avatar Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars');
CREATE POLICY "Avatar Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars');

-- ===========================================
-- VERIFICACIÓN
-- ===========================================
SELECT id, name, public
FROM storage.buckets
WHERE id IN ('product-images', 'avatars')
ORDER BY id;

SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'objects'
  AND (
    policyname LIKE '%Product%' OR
    policyname LIKE '%Avatar%'
  )
ORDER BY policyname;
