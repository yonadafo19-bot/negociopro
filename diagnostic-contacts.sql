-- ===========================================
-- DIAGNÓSTICO RÁPIDO TABLA CONTACTS
-- ===========================================

-- Ver columnas de la tabla contacts
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'contacts'
ORDER BY ordinal_position;
