-- ===========================================
-- DIAGNÓSTICO - Estado actual
-- ===========================================

-- 1. Verificar si transaction_items tiene RLS
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('transactions', 'transaction_items');

-- 2. Verificar políticas de transaction_items
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'transaction_items'
ORDER BY policyname;

-- 3. Verificar la función decrement_stock
SELECT proname as function_name, pg_get_function_arguments(oid) as parameters
FROM pg_proc
WHERE proname = 'decrement_stock';

-- 4. Verificar si la tabla products tiene la columna stock
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'products'
  AND column_name = 'stock';
