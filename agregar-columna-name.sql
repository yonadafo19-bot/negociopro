-- ===========================================
-- AGREGAR COLUMNA 'name' A transaction_items
-- Ejecutar en Supabase SQL Editor
-- ===========================================

-- Agregar columna name si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transaction_items' AND column_name = 'name'
  ) THEN
    ALTER TABLE transaction_items ADD COLUMN name text;
  END IF;
END $$;

-- Verificar que se agregó
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'transaction_items'
ORDER BY ordinal_position;
