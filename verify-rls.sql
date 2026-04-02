-- ===========================================
-- VERIFICAR POLÍTICAS RLS DE CATALOGS
-- Ejecuta esto en el SQL Editor de Supabase
-- ===========================================

-- 1. Verificar que RLS esté activado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('catalogs', 'catalog_products', 'products');

-- 2. Verificar políticas existentes en catalogs
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'catalogs'
ORDER BY policyname;

-- 3. Verificar políticas existentes en catalog_products
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'catalog_products'
ORDER BY policyname;

-- 4. Prueba de query: Ver si el usuario actual puede leer sus catálogos
-- (descomenta para probar)
-- SELECT *, catalog_products(*, products(*))
-- FROM catalogs
-- WHERE user_id = auth.uid()
--   AND is_active = true
-- ORDER BY created_at DESC;
