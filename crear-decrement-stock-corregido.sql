-- ===========================================
-- CREAR FUNCIÓN decrement_stock (CORREGIDA)
-- Ejecutar en Supabase SQL Editor
-- ===========================================

-- Verificar tipo de dato de products.id
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'products' AND column_name = 'id';

-- Eliminar función vieja
DROP FUNCTION IF EXISTS decrement_stock(integer, integer) CASCADE;
DROP FUNCTION IF EXISTS decrement_stock(uuid, integer) CASCADE;
DROP FUNCTION IF EXISTS decrement_stock CASCADE;

-- Crear función con los nombres correctos de parámetros
CREATE OR REPLACE FUNCTION decrement_stock(product_id uuid, quantity integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE products
  SET stock = stock - quantity
  WHERE id = product_id;
END;
$$;

-- Dar permisos
GRANT EXECUTE ON FUNCTION decrement_stock(uuid, integer) TO authenticated;

-- Verificar que se creó
SELECT 'Function created!' as status, proname, pg_get_function_arguments(oid) as params
FROM pg_proc
WHERE proname = 'decrement_stock';
