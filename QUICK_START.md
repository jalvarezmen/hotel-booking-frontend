# 🚀 Guía Rápida de Inicio

## Pasos para ejecutar el proyecto

### 1. Instalar dependencias

```bash
npm install --legacy-peer-deps
```

**Nota:** El flag `--legacy-peer-deps` es necesario por algunas dependencias de shadcn/ui.

### 2. Verificar configuración

El proyecto ya está configurado con:
- ✅ React + TypeScript
- ✅ Vite
- ✅ Tailwind CSS
- ✅ shadcn/ui
- ✅ React Query
- ✅ Axios
- ✅ Variables de entorno

### 3. Iniciar en modo desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### 4. Credenciales de acceso (Modo Demo)

**Gerente:**
- Usuario: `gerente`
- Contraseña: `gerente123`

**Recepcionista:**
- Usuario: `recepcionista`
- Contraseña: `recepcion123`

## 📦 Modo Demo vs Producción

Por defecto, la app funciona en **modo demo** con datos simulados.

### Para cambiar a modo producción (conectar al backend real):

1. Abre `src/App.tsx`
2. Busca la línea: `const DEMO_MODE = true;`
3. Cámbiala a: `const DEMO_MODE = false;`
4. Asegúrate de que tu backend esté corriendo en `http://localhost:8080/api`

## 🐳 Ejecutar con Docker

### Desarrollo:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Producción:
```bash
docker-compose up --build
```

## 📂 Estructura de Componentes

```
src/
├── components/
│   ├── ui/              # Componentes shadcn/ui (Button, Input, etc)
│   ├── common/          # Badge, LoadingSpinner
│   ├── dashboard/       # Dashboard, ReservationCard, StatsCard
│   ├── layout/          # Sidebar
│   └── LoginPage.tsx    # Página de login
├── services/
│   ├── api.ts           # Cliente Axios
│   ├── types.ts         # TypeScript interfaces
│   ├── mockData.ts      # Datos de demo
│   ├── reservationsApi.ts
│   └── roomsApi.ts
└── App.tsx              # Componente principal
```

## 🎨 Paleta de Colores

El proyecto usa una paleta beige/naranja:
- Primary: `#FF6B35` (Naranja)
- Secondary: `#E8DED0` (Beige)
- Background: `#FAF8F5` (Crema)

Puedes modificarlos en `src/index.css`

## 🔧 Comandos útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Preview de build
npm run preview

# Lint
npm run lint
```

## ⚠️ Problemas comunes

### Error de dependencias
```bash
npm install --legacy-peer-deps
```

### Puerto 5173 ocupado
Cambia el puerto en `vite.config.ts`:
```typescript
server: {
  port: 3000  // Cambia aquí
}
```

### Backend no conecta
1. Verifica que el backend esté corriendo
2. Revisa la URL en `.env.local`: `VITE_API_URL=http://localhost:8080/api`
3. Asegúrate de que `DEMO_MODE = false` en `App.tsx`

## 📱 Funcionalidades Disponibles

### ✅ Implementadas:
- Login con roles
- Dashboard con estadísticas
- Lista de check-ins del día
- Lista de check-outs del día
- Realizar check-in
- Realizar check-out
- Notificaciones toast
- Sidebar con navegación
- Modo demo

### 🚧 Pendientes:
- Nueva reserva (formulario)
- Búsqueda de reservas
- Gestión de habitaciones
- Perfil de usuario

## 🎯 Próximos pasos

1. ✅ Instalar dependencias
2. ✅ Ejecutar `npm run dev`
3. ✅ Probar el login
4. ✅ Ver el dashboard
5. 🔄 Conectar con tu backend (cambiar `DEMO_MODE`)
6. 🔄 Implementar funcionalidades pendientes

---

**¡Ya está todo listo para empezar a desarrollar! 🎉**
