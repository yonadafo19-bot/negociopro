-- ===========================================
-- NEGOCIPRO - DATOS DE EJEMPLO (OPCIONAL)
-- ===========================================

-- NOTA: Esta migración es opcional y solo para desarrollo/propósitos de demostración
-- NO ejecutar en producción

-- ===========================================
-- EJEMPLO: INSERTAR DATOS DE PRUEBA
-- ===========================================

-- Descomenta para insertar datos de ejemplo para un usuario específico
-- Reemplaza 'YOUR_USER_ID' con el UUID del usuario de prueba

/*
-- Insertar productos de ejemplo
INSERT INTO products (user_id, name, description, category, cost_price, selling_price, stock_quantity, min_stock_alert) VALUES
  ('YOUR_USER_ID', 'Café Premium 1kg', 'Café de grano premium', 'Bebidas', 15.00, 25.00, 50, 10),
  ('YOUR_USER_ID', 'Azúcar 1kg', 'Azúcar blanca refinada', 'Alimentos', 1.50, 3.00, 100, 20),
  ('YOUR_USER_ID', 'Galletas de Chocolate', 'Paquete de galletas', 'Alimentos', 2.00, 4.50, 30, 10),
  ('YOUR_USER_ID', 'Leche Entera 1L', 'Leche fresca', 'Bebidas', 1.00, 2.50, 40, 15),
  ('YOUR_USER_ID', 'Pan de Molde', 'Pan rebanado', 'Alimentos', 2.50, 5.00, 20, 5);

-- Insertar contactos de ejemplo
INSERT INTO contacts (user_id, name, email, phone, contact_type) VALUES
  ('YOUR_USER_ID', 'María González', 'maria@email.com', '+52 55 1234 5678', 'customer'),
  ('YOUR_USER_ID', 'Juan Pérez', 'juan@email.com', '+52 55 8765 4321', 'customer'),
  ('YOUR_USER_ID', 'Proveedor ABC', 'contacto@proveedorabc.com', '+52 55 1111 2222', 'supplier'),
  ('YOUR_USER_ID', 'Distribuidora XYZ', 'ventas@xyz.com', '+52 55 3333 4444', 'supplier');

-- Insertar transacción de ejemplo
WITH test_transaction AS (
  INSERT INTO transactions (user_id, contact_id, transaction_type, total_amount, status)
  VALUES ('YOUR_USER_ID', (SELECT id FROM contacts WHERE name = 'María González' LIMIT 1), 'sale', 35.50, 'completed')
  RETURNING id
)
INSERT INTO transaction_items (transaction_id, product_id, quantity, unit_price, subtotal)
SELECT
  test_transaction.id,
  p.id,
  2, -- cantidad
  p.selling_price,
  p.selling_price * 2
FROM test_transaction
CROSS JOIN products p
WHERE p.user_id = 'YOUR_USER_ID' AND p.name = 'Café Premium 1kg'
LIMIT 1;
*/

-- ===========================================
-- COMENTARIOS
-- ===========================================

COMMENT ON SCRIPT IS 'Datos de ejemplo para desarrollo. Descomentar y reemplazar YOUR_USER_ID para usar.';
