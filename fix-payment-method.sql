-- ===========================================
-- VERIFICAR Y ARREGLAR payment_method EN transactions
-- Ejecutar en Supabase SQL Editor
-- ===========================================

-- 1. Verificar si la columna payment_method existe
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'transactions'
  AND column_name = 'payment_method';

-- 2. Si no existe, agregarla
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE transactions ADD COLUMN payment_method text;
  END IF;
END $$;

-- 3. Actualizar ventas existentes sin método de pago a 'cash'
UPDATE transactions
SET payment_method = 'cash'
WHERE payment_method IS NULL
  AND transaction_type = 'sale';

-- 4. Verificar resultados
SELECT
  payment_method,
  COUNT(*) as cantidad,
  SUM(total_amount) as total
FROM transactions
WHERE transaction_type = 'sale'
GROUP BY payment_method;
