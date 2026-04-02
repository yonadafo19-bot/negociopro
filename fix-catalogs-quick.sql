-- Fix rápido para catalogs
-- Ejecutar en Supabase SQL Editor

-- Habilitar RLS
ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_products ENABLE ROW LEVEL SECURITY;

-- Crear políticas para catalogs
CREATE POLICY "Users can view own catalogs" ON catalogs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view public catalogs" ON catalogs FOR SELECT USING (is_public = true);
CREATE POLICY "Users can insert own catalogs" ON catalogs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own catalogs" ON catalogs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own catalogs" ON catalogs FOR DELETE USING (auth.uid() = user_id);

-- Crear políticas para catalog_products
CREATE POLICY "Users can view catalog products" ON catalog_products FOR SELECT USING (
  EXISTS (SELECT 1 FROM catalogs WHERE catalogs.id = catalog_products.catalog_id AND (catalogs.user_id = auth.uid() OR catalogs.is_public = true))
);

CREATE POLICY "Users can modify catalog products" ON catalog_products FOR ALL USING (
  EXISTS (SELECT 1 FROM catalogs WHERE catalogs.id = catalog_products.catalog_id AND catalogs.user_id = auth.uid())
);
