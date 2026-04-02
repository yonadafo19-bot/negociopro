-- ===========================================
-- CREAR FUNCIÓN decrement_stock
-- Ejecutar en Supabase SQL Editor
-- ===========================================

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
GRANT EXECUTE ON FUNCTION decrement_stock TO authenticated;

-- Verificar que se creó
SELECT 'Function created successfully!' as status, proname
FROM pg_proc
WHERE proname = 'decrement_stock';
