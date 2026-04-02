-- ===========================================
-- FIX COMPLETO PARA VENTAS
-- Ejecutar en Supabase SQL Editor
-- ===========================================

-- ===========================================
-- 1. TABLA transaction_items - RLS
-- ===========================================

-- Habilitar RLS
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas viejas
DROP POLICY IF EXISTS "Users can view own transaction items" ON transaction_items;
DROP POLICY IF EXISTS "Users can insert own transaction items" ON transaction_items;
DROP POLICY IF EXISTS "Users can update own transaction items" ON transaction_items;
DROP POLICY IF EXISTS "Users can delete own transaction items" ON transaction_items;

-- Crear políticas nuevas
CREATE POLICY "Users can view own transaction items" ON transaction_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM transactions WHERE transactions.id = transaction_items.transaction_id AND transactions.user_id = auth.uid())
);

CREATE POLICY "Users can insert own transaction items" ON transaction_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM transactions WHERE transactions.id = transaction_items.transaction_id AND transactions.user_id = auth.uid())
);

CREATE POLICY "Users can update own transaction items" ON transaction_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM transactions WHERE transactions.id = transaction_items.transaction_id AND transactions.user_id = auth.uid())
);

CREATE POLICY "Users can delete own transaction items" ON transaction_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM transactions WHERE transactions.id = transaction_items.transaction_id AND transactions.user_id = auth.uid())
);

-- ===========================================
-- 2. TABLA transactions - RLS
-- ===========================================

-- Habilitar RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas viejas
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON transactions;

-- Crear políticas nuevas
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON transactions FOR DELETE USING (auth.uid() = user_id);

-- ===========================================
-- 3. FUNCIÓN decrement_stock (RPC)
-- ===========================================

-- Eliminar función si existe
DROP FUNCTION IF EXISTS decrement_stock(integer, integer);

-- Crear función
CREATE OR REPLACE FUNCTION decrement_stock(product_id integer, quantity integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE products
  SET stock = stock - quantity
  WHERE id = product_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Producto no encontrado: %', product_id;
  END IF;
END;
$$;

-- ===========================================
-- VERIFICACIÓN
-- ===========================================

-- Ver políticas de transaction_items
SELECT 'transaction_items policies:' as info, policyname, cmd
FROM pg_policies
WHERE tablename = 'transaction_items'
ORDER BY policyname;

-- Ver políticas de transactions
SELECT 'transactions policies:' as info, policyname, cmd
FROM pg_policies
WHERE tablename = 'transactions'
ORDER BY policyname;

-- Ver función decrement_stock
SELECT 'decrement_stock function:' as info, routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name = 'decrement_stock';
