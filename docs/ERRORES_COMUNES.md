# 🚨 Errores Comunes y Soluciones - NegociPro

Esta guía documenta los errores comunes encontrados durante el desarrollo y cómo solucionarlos.

## 🔐 Errores de Autenticación

### Error 1: "Loading infinito"

**Problema**: AuthContext nunca setea `loading: false`

**Solución**:
```javascript
// ❌ MAL
const [loading, setLoading] = useState(true)

// ✅ BIEN
const [loading, setLoading] = useState(false)

// Timeout de seguridad
useEffect(() => {
  const timeout = setTimeout(() => setLoading(false), 3000)
  return () => clearTimeout(timeout)
}, [])
```

**Dónde se documentó**: `src/context/AuthContext.jsx`

---

### Error 2: "Cannot read property of null"

**Problema**: Acceder a propiedades sin verificar existencia

**Solución**:
```javascript
// ❌ MAL
user.email
profile.business_name

// ✅ BIEN
user?.email
profile?.business_name || 'Mi Negocio'
```

---

### Error 3: "useEffect dependency warning"

**Problema**: Falta dependencia en array

**Solución**:
```javascript
// ❌ MAL
useEffect(() => {
  fetchData(userId)
}, []) // falta userId

// ✅ BIEN
useEffect(() => {
  if (userId) fetchData(userId)
}, [userId])
```

---

## 🔌 Errores de Supabase

### Error 4: "Supabase connection failed"

**Problema**: Variables de entorno no cargadas

**Solución**:
```javascript
// .env DEBE empezar con VITE_
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

// Acceder con import.meta.env
const url = import.meta.env.VITE_SUPABASE_URL
```

**Dónde se documentó**: `src/services/supabase.js`

---

### Error 5: "RLS policy violated"

**Problema**: Row Level Security bloqueando queries

**Solución**:
```sql
-- Crear políticas para cada usuario
CREATE POLICY "Users can view own data" ON profiles
FOR SELECT USING (auth.uid() = id);
```

**Dónde se documentó**: `supabase/migrations/002_rls_policies.sql`

---

### Error 6: "Profile not found after signup"

**Problema**: El perfil no se crea automáticamente al registrar

**Solución**: Crear trigger automático en Supabase

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, business_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'business_name', 'Mi Negocio')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

**Dónde se documentó**: `supabase/migrations/002_rls_policies.sql`

---

## 🎨 Errores de UI/UX

### Error 7: "White screen after deployment"

**Problema**: Build incorrecto o rutas mal configuradas

**Solución**:
```javascript
// vite.config.js
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

---

### Error 8: "Styles not loading"

**Problema**: TailwindCSS no está configurado correctamente

**Solución**:
```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // ...
}
```

---

## 📱 Errores de Performance

### Error 9: "Lighthouse penaliza imágenes grandes"

**Problema**: Score de performance bajo (< 80)

**Solución**:
- Usar WebP, max 80KB
- Lazy loading
- Optimizar imágenes antes de subir

**Aplica en**: Todas las features con imágenes

---

### Error 10: "Zustand hydration mismatch"

**Problema**: Error de hidratación en SSR

**Solución**:
```javascript
// No aplica para Vite (no SSR), pero si se usa:
import { create } from 'zustand'

const useStore = create((set) => ({
  // ...
}))

// Para persist en localStorage:
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({ /* ... */ }),
    { name: 'storage' }
  )
)
```

---

## 🧪 Errores de Testing

### Error 11: "Tests failing after refactoring"

**Problema**: Los tests asumen estructura antigua

**Solución**: Mantener tests actualizados con cada refactor

---

## 🚀 Errores de Deploy

### Error 12: "Environment variables not working in production"

**Problema**: Variables no configuradas en Vercel/Netlify

**Solución**:
1. Ir al dashboard de deploy
2. Settings → Environment Variables
3. Agregar:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

---

## 📚 Referencias

### Dónde documentar aprendizajes:

| Tipo de Error | Dónde Documentar |
|---------------|------------------|
| Específico de una feature | Docs de esa feature |
| Aplica a múltiples features | Este archivo |
| Aplica a TODO el proyecto | `docs/SETUP.md` |

### Formato de documentación:

```markdown
### [YYYY-MM-DD]: [Título corto]
- **Error**: [Qué falló exactamente]
- **Fix**: [Cómo se arregló]
- **Aplicar en**: [Dónde más aplica este conocimiento]
```

---

## 🔄 Actualización

Este archivo se actualiza conforme se encuentran nuevos errores durante el desarrollo.

**Última actualización**: 2024-03-13
