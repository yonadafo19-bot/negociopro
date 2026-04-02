-- ===========================================
-- VERIFICAR Y ARREGLAR
-- Ejecutar en Supabase SQL Editor
-- ===========================================

-- 1. Verificar que la columna stock existe en products
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'products' AND column_name = 'stock';

-- 2. Si no existe, agregarla
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'stock'
  ) THEN
    ALTER TABLE products ADD COLUMN stock integer DEFAULT 0;
  END IF;
END $$;

-- 3. Recrear la función con manejo de errores mejorado
DROP FUNCTION IF EXISTS decrement_stock(uuid, integer) CASCADE;

CREATE OR REPLACE FUNCTION decrement_stock(product_id uuid, quantity integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE products
  SET stock = GREATEST(0, stock - quantity)  -- No permitir stock negativo
  WHERE id = product_id;
END;
$$;

GRANT EXECUTE ON FUNCTION decrement_stock(uuid, integer) TO authenticated;

-- 4. Verificar
SELECT 'Done! Function updated.' as status;
