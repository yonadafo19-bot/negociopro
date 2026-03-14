-- ===========================================
-- NEGOCIPRO - ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_products ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- POLICIES PARA PROFILES
-- ===========================================

-- Los usuarios pueden ver solo su perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Los usuarios pueden actualizar su perfil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Los usuarios pueden insertar su perfil (al registrarse)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ===========================================
-- POLICIES PARA PRODUCTS
-- ===========================================

-- Los usuarios pueden ver solo sus productos activos
CREATE POLICY "Users can view own products"
  ON products FOR SELECT
  USING (auth.uid() = user_id AND is_active = true);

-- Los usuarios pueden insertar sus productos
CREATE POLICY "Users can insert own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden actualizar sus productos
CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  USING (auth.uid() = user_id);

-- Los usuarios pueden eliminar (soft delete) sus productos
CREATE POLICY "Users can delete own products"
  ON products FOR UPDATE
  USING (auth.uid() = user_id);

-- ===========================================
-- POLICIES PARA CONTACTS
-- ===========================================

-- Los usuarios pueden ver solo sus contactos activos
CREATE POLICY "Users can view own contacts"
  ON contacts FOR SELECT
  USING (auth.uid() = user_id AND is_active = true);

-- Los usuarios pueden insertar sus contactos
CREATE POLICY "Users can insert own contacts"
  ON contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden actualizar sus contactos
CREATE POLICY "Users can update own contacts"
  ON contacts FOR UPDATE
  USING (auth.uid() = user_id);

-- Los usuarios pueden eliminar (soft delete) sus contactos
CREATE POLICY "Users can delete own contacts"
  ON contacts FOR UPDATE
  USING (auth.uid() = user_id);

-- ===========================================
-- POLICIES PARA TRANSACTIONS
-- ===========================================

-- Los usuarios pueden ver solo sus transacciones
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Los usuarios pueden insertar sus transacciones
CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden actualizar sus transacciones
CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

-- Los usuarios pueden eliminar sus transacciones
CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- ===========================================
-- POLICIES PARA TRANSACTION_ITEMS
-- ===========================================

-- Los usuarios pueden ver items de sus transacciones
CREATE POLICY "Users can view own transaction items"
  ON transaction_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM transactions
      WHERE transactions.id = transaction_items.transaction_id
      AND transactions.user_id = auth.uid()
    )
  );

-- Los usuarios pueden insertar items en sus transacciones
CREATE POLICY "Users can insert own transaction items"
  ON transaction_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM transactions
      WHERE transactions.id = transaction_items.transaction_id
      AND transactions.user_id = auth.uid()
    )
  );

-- ===========================================
-- POLICIES PARA INVENTORY_MOVEMENTS
-- ===========================================

-- Los usuarios pueden ver movimientos de sus productos
CREATE POLICY "Users can view own inventory movements"
  ON inventory_movements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = inventory_movements.product_id
      AND products.user_id = auth.uid()
    )
  );

-- Los usuarios pueden insertar movimientos de sus productos
CREATE POLICY "Users can insert own inventory movements"
  ON inventory_movements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = inventory_movements.product_id
      AND products.user_id = auth.uid()
    )
  );

-- ===========================================
-- POLICIES PARA CATALOGS
-- ===========================================

-- Los usuarios pueden ver sus propios catálogos
CREATE POLICY "Users can view own catalogs"
  ON catalogs FOR SELECT
  USING (auth.uid() = user_id);

-- Cualquier persona puede ver catálogos públicos por share_link
CREATE POLICY "Anyone can view public catalogs"
  ON catalogs FOR SELECT
  USING (is_public = true);

-- Los usuarios pueden insertar sus catálogos
CREATE POLICY "Users can insert own catalogs"
  ON catalogs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden actualizar sus catálogos
CREATE POLICY "Users can update own catalogs"
  ON catalogs FOR UPDATE
  USING (auth.uid() = user_id);

-- Los usuarios pueden eliminar sus catálogos
CREATE POLICY "Users can delete own catalogs"
  ON catalogs FOR DELETE
  USING (auth.uid() = user_id);

-- ===========================================
-- POLICIES PARA CATALOG_PRODUCTS
-- ===========================================

-- Los usuarios pueden ver productos de sus catálogos
CREATE POLICY "Users can view own catalog products"
  ON catalog_products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM catalogs
      WHERE catalogs.id = catalog_products.catalog_id
      AND catalogs.user_id = auth.uid()
    )
  );

-- Cualquier persona puede ver productos de catálogos públicos
CREATE POLICY "Anyone can view public catalog products"
  ON catalog_products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM catalogs
      WHERE catalogs.id = catalog_products.catalog_id
      AND catalogs.is_public = true
    )
  );

-- Los usuarios pueden insertar productos en sus catálogos
CREATE POLICY "Users can insert own catalog products"
  ON catalog_products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM catalogs
      WHERE catalogs.id = catalog_products.catalog_id
      AND catalogs.user_id = auth.uid()
    )
    AND
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = catalog_products.product_id
      AND products.user_id = auth.uid()
    )
  );

-- Los usuarios pueden eliminar productos de sus catálogos
CREATE POLICY "Users can delete own catalog products"
  ON catalog_products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM catalogs
      WHERE catalogs.id = catalog_products.catalog_id
      AND catalogs.user_id = auth.uid()
    )
  );

-- ===========================================
-- FUNCIONES DE SEGURIDAD
-- ===========================================

-- Función para crear perfil automáticamente al registrar usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, business_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'business_name', 'Mi Negocio')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- COMENTARIOS
-- ===========================================

COMMENT ON FUNCTION handle_new_user IS 'Crea automáticamente un perfil cuando un usuario se registra';
