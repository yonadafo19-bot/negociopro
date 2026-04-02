-- ===========================================
-- FIX DEFINITIVO PARA VENTAS
-- Ejecutar en Supabase SQL Editor
-- ===========================================

-- ===========================================
-- 1. TRANSACTION_ITEMS - Arreglar RLS
-- ===========================================

-- Primero deshabilitar RLS para poder limpiar
ALTER TABLE transaction_items DISABLE ROW LEVEL SECURITY;

-- Volver a habilitar
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;

-- Crear políticas simples (permitir todo a usuarios autenticados)
DROP POLICY IF EXISTS "Auth select transaction_items" ON transaction_items;
DROP POLICY IF EXISTS "Auth insert transaction_items" ON transaction_items;
DROP POLICY IF EXISTS "Auth update transaction_items" ON transaction_items;
DROP POLICY IF EXISTS "Auth delete transaction_items" ON transaction_items;

CREATE POLICY "Auth select transaction_items" ON transaction_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert transaction_items" ON transaction_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update transaction_items" ON transaction_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete transaction_items" ON transaction_items FOR DELETE TO authenticated USING (true);

-- ===========================================
-- 2. TRANSACTIONS - Arreglar RLS
-- ===========================================

-- Deshabilitar y volver a habilitar
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Crear políticas simples
DROP POLICY IF EXISTS "Auth select transactions" ON transactions;
DROP POLICY IF EXISTS "Auth insert transactions" ON transactions;
DROP POLICY IF EXISTS "Auth update transactions" ON transactions;
DROP POLICY IF EXISTS "Auth delete transactions" ON transactions;

CREATE POLICY "Auth select transactions" ON transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert transactions" ON transactions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update transactions" ON transactions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete transactions" ON transactions FOR DELETE TO authenticated USING (true);

-- ===========================================
-- 3. FUNCIÓN decrement_stock
-- ===========================================

-- Eliminar y recrear
DROP FUNCTION IF EXISTS decrement_stock(integer, integer) CASCADE;

CREATE OR REPLACE FUNCTION decrement_stock(product_id_param integer, quantity_param integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE products
  SET stock = stock - quantity_param
  WHERE id = product_id_param;
END;
$$;

-- Dar permisos
GRANT EXECUTE ON FUNCTION decrement_stock(integer, integer) TO authenticated;

-- ===========================================
-- VERIFICACIÓN
-- ===========================================

-- Mostrar políticas creadas
SELECT 'transaction_items:' as tabla, policyname, cmd
FROM pg_policies
WHERE tablename = 'transaction_items'
UNION ALL
SELECT 'transactions:' as tabla, policyname, cmd
FROM pg_policies
WHERE tablename = 'transactions';

-- Mostrar función
SELECT 'decrement_stock function created' as status, proname
FROM pg_proc
WHERE proname = 'decrement_stock';
