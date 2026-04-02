-- ===========================================
-- DIAGNÓSTICO DE ERRORES DE CATALOGS
-- Ejecuta esto en el SQL Editor de Supabase
-- ===========================================

-- 1. Verificar si las tablas existen
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('catalogs', 'catalog_products', 'products');

-- 2. Verificar si RLS está activado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('catalogs', 'catalog_products', 'products');

-- 3. Verificar políticas de catalogs
SELECT policyname, cmd, permissive, roles
FROM pg_policies
WHERE tablename = 'catalogs'
ORDER BY policyname;

-- 4. Verificar políticas de catalog_products
SELECT policyname, cmd, permissive, roles
FROM pg_policies
WHERE tablename = 'catalog_products'
ORDER BY policyname;

-- 5. Verificar si hay datos en catalogs
SELECT COUNT(*) as total_catalogs
FROM catalogs;

-- 6. Probar la query directa (reemplaza el UUID con tu user_id)
SELECT c.*, cp.*, p.*
FROM catalogs c
LEFT JOIN catalog_products cp ON c.id = cp.catalog_id
LEFT JOIN products p ON cp.product_id = p.id
WHERE c.user_id = '832c47a9-cb17-4ad5-bfeb-27caf7224e7b'::uuid
  AND c.is_active = true
ORDER BY c.created_at DESC
LIMIT 10;

-- 7. Si no hay políticas, ejecutar esto para crearlas:
-- (Descomenta y ejecuta si no hay políticas)

/*
-- Habilitar RLS
ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_products ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes (si las hay)
DROP POLICY IF EXISTS "Users can view own catalogs" ON catalogs;
DROP POLICY IF EXISTS "Anyone can view public catalogs" ON catalogs;
DROP POLICY IF EXISTS "Users can insert own catalogs" ON catalogs;
DROP POLICY IF EXISTS "Users can update own catalogs" ON catalogs;
DROP POLICY IF EXISTS "Users can delete own catalogs" ON catalogs;

DROP POLICY IF EXISTS "Users can view catalog products" ON catalog_products;
DROP POLICY IF EXISTS "Users can modify catalog products" ON catalog_products;

-- Crear políticas para catalogs
CREATE POLICY "Users can view own catalogs"
  ON catalogs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public catalogs"
  ON catalogs FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can insert own catalogs"
  ON catalogs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own catalogs"
  ON catalogs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own catalogs"
  ON catalogs FOR DELETE
  USING (auth.uid() = user_id);

-- Crear políticas para catalog_products
CREATE POLICY "Users can view catalog products"
  ON catalog_products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM catalogs
      WHERE catalogs.id = catalog_products.catalog_id
        AND (catalogs.user_id = auth.uid() OR catalogs.is_public = true)
    )
  );

CREATE POLICY "Users can modify catalog products"
  ON catalog_products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM catalogs
      WHERE catalogs.id = catalog_products.catalog_id
        AND catalogs.user_id = auth.uid()
    )
  );
*/
