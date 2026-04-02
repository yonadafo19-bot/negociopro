-- ============================================================
-- NEGOCIPRO - SQL COMPLETO (BORRA Y CREA NUEVAMENTE)
-- Ejecuta esto en Supabase SQL Editor
-- ============================================================

-- 1. ELIMINAR TABLAS Y POLÍTICAS EXISTENTES
DROP TABLE IF EXISTS catalog_products CASCADE;
DROP TABLE IF EXISTS catalogs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

-- 2. TABLA DE NOTIFICACIONES
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'product_created', 'product_updated', 'product_deleted',
    'stock_low', 'stock_out', 'stock_added', 'stock_removed',
    'customer_created', 'customer_updated', 'customer_deleted',
    'sale_created', 'sale_refunded', 'payment_received',
    'catalog_created', 'catalog_updated', 'catalog_deleted',
    'catalog_shared', 'catalog_viewed',
    'expense_created', 'expense_updated', 'expense_deleted',
    'user_login', 'user_logout', 'settings_updated'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own notifications" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notifications" ON notifications FOR DELETE USING (auth.uid() = user_id);

-- 3. TABLA DE CATÁLOGOS
CREATE TABLE catalogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  theme TEXT DEFAULT 'default' CHECK (theme IN ('default', 'blue', 'green', 'purple', 'orange')),
  is_public BOOLEAN DEFAULT true,
  share_link TEXT UNIQUE NOT NULL DEFAULT (encode(gen_random_bytes(12), 'base64')),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_catalogs_user_id ON catalogs(user_id);
CREATE INDEX idx_catalogs_share_link ON catalogs(share_link);
CREATE INDEX idx_catalogs_created_at ON catalogs(created_at DESC);

ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own catalogs" ON catalogs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own catalogs" ON catalogs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own catalogs" ON catalogs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own catalogs" ON catalogs FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Public catalogs are viewable by share link" ON catalogs FOR SELECT USING (is_public = true);

-- 4. TABLA DE PRODUCTOS EN CATÁLOGOS
CREATE TABLE catalog_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_id UUID NOT NULL REFERENCES catalogs(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(catalog_id, product_id)
);

CREATE INDEX idx_catalog_products_catalog_id ON catalog_products(catalog_id);
CREATE INDEX idx_catalog_products_product_id ON catalog_products(product_id);

ALTER TABLE catalog_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view products in their catalogs" ON catalog_products FOR SELECT USING (
  EXISTS (SELECT 1 FROM catalogs WHERE catalogs.id = catalog_products.catalog_id AND catalogs.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM catalogs WHERE catalogs.id = catalog_products.catalog_id AND catalogs.is_public = true)
);

CREATE POLICY "Users can modify products in their catalogs" ON catalog_products FOR ALL USING (
  EXISTS (SELECT 1 FROM catalogs WHERE catalogs.id = catalog_products.catalog_id AND catalogs.user_id = auth.uid())
);

-- 5. AGREGAR avatar_url A PROFILES
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- 6. FUNCIONES Y TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_catalogs_updated_at ON catalogs;
CREATE TRIGGER update_catalogs_updated_at BEFORE UPDATE ON catalogs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verificación
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'catalogs' ORDER BY ordinal_position;
