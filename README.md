# Hotel Booking Frontend 🏨

Sistema de gestión de reservas de hoteles desarrollado con React, TypeScript, Vite, Tailwind CSS y shadcn/ui.

## ✨ Características

- 🎨 **Diseño moderno** con shadcn/ui y Tailwind CSS
- 🔐 **Sistema de autenticación** con roles (Gerente/Recepcionista)
- 📊 **Dashboard** con estadísticas y reservas del día
- 🏠 **Gestión de reservas** (Check-in/Check-out)
- 🎯 **Interfaz responsiva** y optimizada
- ⚡ **React Query** para manejo de estado del servidor
- 🌙 **Modo oscuro** incluido
- 🐳 **Docker** configurado para desarrollo y producción

## 📋 Requisitos Previos

- Node.js 20.x o superior
- npm o yarn
- Docker y Docker Compose (opcional)
- Backend API corriendo en `http://localhost:8080/api`

## 🚀 Instalación Local

### 1. Instalar dependencias

```bash
npm install
```

**Nota**: Si encuentras problemas con las dependencias, usa:
```bash
npm install --legacy-peer-deps
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y ajusta las variables:

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```env
VITE_API_URL=http://localhost:8080/api
```

### 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🐳 Despliegue con Docker

### Modo Desarrollo

```bash
docker-compose -f docker-compose.dev.yml up --build
```

Esto iniciará el servidor de desarrollo con hot-reload en el puerto 5173.

### Modo Producción

```bash
docker-compose up --build
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
hotel-booking-frontend/
├── src/
│   ├── components/           # Componentes React
│   │   ├── ui/              # Componentes shadcn/ui
│   │   ├── common/          # Componentes comunes
│   │   ├── dashboard/       # Componentes del dashboard
│   │   ├── layout/          # Layout components (Sidebar)
│   │   └── LoginPage.tsx    # Página de login
│   ├── services/            # Servicios para API
│   │   ├── api.ts          # Cliente Axios configurado
│   │   ├── types.ts        # TypeScript types e interfaces
│   │   ├── mockData.ts     # Datos de prueba
│   │   ├── reservationsApi.ts  # API de reservas
│   │   └── roomsApi.ts     # API de habitaciones
│   ├── lib/                # Utilidades
│   │   └── utils.ts        # Funciones helper (cn, etc)
│   ├── utils/              # Utilidades adicionales
│   │   └── formatters.ts   # Formateadores de datos
│   ├── App.tsx             # Componente principal
│   ├── main.tsx            # Punto de entrada
│   └── index.css           # Estilos globales
├── public/                 # Archivos estáticos
├── Dockerfile              # Imagen de producción
├── Dockerfile.dev          # Imagen de desarrollo
├── docker-compose.yml      # Orquestación producción
├── docker-compose.dev.yml  # Orquestación desarrollo
├── components.json         # Configuración shadcn/ui
├── tailwind.config.js      # Configuración Tailwind
├── tsconfig.json           # Configuración TypeScript
└── vite.config.ts          # Configuración Vite
```

## 🎨 Tecnologías y Librerías

### Core
- **React 18.3** - Librería UI
- **TypeScript 5.3** - Tipado estático
- **Vite 6.3** - Build tool y dev server
- **React Router DOM 6.22** - Routing

### UI Components
- **shadcn/ui** - Sistema de componentes
- **Radix UI** - Primitivos accesibles
- **Tailwind CSS 3.4** - Framework CSS
- **Lucide React** - Iconos

### Estado y Datos
- **TanStack Query (React Query)** - Manejo de estado del servidor
- **Axios** - Cliente HTTP
- **React Hook Form** - Manejo de formularios

### Otros
- **Sonner** - Notificaciones toast
- **Recharts** - Gráficos y estadísticas
- **date-fns** - Manejo de fechas

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la build de producción
- `npm run lint` - Ejecuta el linter ESLint

## 🔐 Usuarios de Prueba

### Modo Demo (DEMO_MODE = true en App.tsx)

```
Gerente:
- Usuario: gerente
- Contraseña: gerente123

Recepcionista:
- Usuario: recepcionista
- Contraseña: recepcion123
```

## 🌐 Conexión con el Backend

El servicio API está configurado en `src/services/api.ts` para conectarse al backend en:

```
http://localhost:8080/api
```

### Modo Demo

Por defecto, la aplicación funciona en **modo demo** con datos mockeados. Para conectar con el backend real:

1. Abre `src/App.tsx`
2. Cambia `const DEMO_MODE = true` a `const DEMO_MODE = false`
3. Asegúrate de que el backend esté corriendo

### Endpoints utilizados

```typescript
GET  /api/reservations/today      # Obtener reservas del día
POST /api/reservations/{id}/check-in   # Realizar check-in
POST /api/reservations/{id}/check-out  # Realizar check-out
GET  /api/rooms                   # Obtener habitaciones
POST /api/reservations            # Crear nueva reserva
```

## 🎯 Funcionalidades Implementadas

### ✅ Completadas
- Sistema de login con roles
- Dashboard con métricas
- Visualización de reservas del día (Check-ins y Check-outs)
- Realizar Check-in y Check-out
- Sidebar con navegación
- Sistema de notificaciones
- Modo demo con datos mockeados
- Diseño responsive
- Integración con React Query

### 🚧 Por Implementar
- Nueva reserva (formulario multi-paso)
- Búsqueda de reservas
- Gestión de habitaciones (CRUD)
- Perfil de usuario
- Reportes y estadísticas avanzadas
- Gestión de pagos
- Historial de reservas

## 🎨 Personalización del Tema

Los colores del tema están definidos en `src/index.css`. La paleta actual usa tonos beige/naranja:

```css
:root {
  --primary: #FF6B35;      /* Naranja principal */
  --secondary: #E8DED0;    /* Beige */
  --background: #FAF8F5;   /* Fondo claro */
  --muted: #F0EAE0;        /* Beige claro */
  --accent: #FFD7BA;       /* Naranja claro */
}
```

## 📝 Documentación de Componentes

Los componentes de UI están basados en shadcn/ui. Documentación completa en:
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)

## 🤝 Contribuir

1. Crea un branch para tu feature
2. Realiza tus cambios
3. Ejecuta el linter y corrige errores: `npm run lint`
4. Envía un pull request

## 📄 Licencia

[Especifica tu licencia aquí]

## 🐛 Problemas Conocidos

- Si encuentras errores de tipos con las dependencias, usa `npm install --legacy-peer-deps`
- Asegúrate de tener la versión correcta de Node.js (20.x)

## 📞 Soporte

Para problemas o preguntas, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ usando React, TypeScript y shadcn/ui**

