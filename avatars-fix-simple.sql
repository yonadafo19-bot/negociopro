-- ===========================================
-- FIX SIMPLE PARA AVATARES - COPIAR Y EJECUTAR
-- ===========================================

-- 1. Crear bucket avatars (público por ahora para que funcione)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Dar permisos a usuarios autenticados
CREATE POLICY "Avatar Public Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Avatar Public Select" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'avatars');
CREATE POLICY "Avatar Public Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars');
CREATE POLICY "Avatar Public Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars');
