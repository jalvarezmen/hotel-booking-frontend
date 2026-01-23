# 📁 Estructura del Proyecto Frontend - Sistema de Reservas Hotel

Este documento explica archivo por archivo la función y propósito de cada componente en el proyecto frontend.

---

## 📋 Índice

1. [Archivos de Configuración Raíz](#archivos-de-configuración-raíz)
2. [Punto de Entrada y App Principal](#punto-de-entrada-y-app-principal)
3. [Servicios y APIs](#servicios-y-apis)
4. [Componentes de UI Base](#componentes-de-ui-base)
5. [Componentes Comunes](#componentes-comunes)
6. [Componentes de Layout](#componentes-de-layout)
7. [Componentes de Funcionalidades](#componentes-de-funcionalidades)
8. [Utilidades](#utilidades)
9. [Archivos Estáticos](#archivos-estáticos)
10. [Docker y Deployment](#docker-y-deployment)

---

## Archivos de Configuración Raíz

### `package.json`
**Función**: Define las dependencias del proyecto, scripts de npm, y metadatos del proyecto.

**Contiene**:
- **Dependencies**: React, TypeScript, Vite, Tailwind, shadcn/ui, React Query, Axios, etc.
- **Scripts**: 
  - `dev`: Inicia servidor de desarrollo
  - `build`: Compila para producción
  - `lint`: Ejecuta ESLint
  - `preview`: Previsualiza build de producción

**Uso**: Gestiona todas las dependencias y comandos del proyecto.

---

### `package-lock.json`
**Función**: Lock file que asegura versiones exactas de dependencias.

**Uso**: Garantiza que todos los desarrolladores usen las mismas versiones de paquetes.

---

### `tsconfig.json`
**Función**: Configuración principal de TypeScript para el proyecto.

**Configura**:
- Modo estricto activado
- Paths y aliases
- Opciones de compilación
- Inclusiones y exclusiones de archivos

**Uso**: Define cómo TypeScript compila y valida el código.

---

### `tsconfig.node.json`
**Función**: Configuración de TypeScript específica para archivos de Node.js (Vite config, etc.).

**Uso**: Separa la configuración de código fuente del código de herramientas.

---

### `vite.config.ts`
**Función**: Configuración del bundler Vite.

**Configura**:
- Plugins (React, SWC)
- Alias de paths
- Variables de entorno
- Configuración de build

**Uso**: Controla cómo Vite compila y sirve la aplicación.

---

### `tailwind.config.js`
**Función**: Configuración de Tailwind CSS con tema personalizado.

**Configura**:
- Colores del tema (beige, naranja, marrón)
- Tipografía
- Espaciado personalizado
- Plugins adicionales

**Uso**: Define el sistema de diseño visual de la aplicación.

---

### `postcss.config.js`
**Función**: Configuración de PostCSS para procesar CSS.

**Plugins**:
- Tailwind CSS
- Autoprefixer

**Uso**: Procesa los estilos CSS antes de incluirlos en el build.

---

### `components.json`
**Función**: Configuración de shadcn/ui para la instalación de componentes.

**Uso**: Define dónde se instalan los componentes de shadcn/ui y cómo se configuran.

---

### `.eslintrc.cjs`
**Función**: Configuración de ESLint para validación de código.

**Reglas**:
- TypeScript strict
- React hooks
- React refresh
- No unused variables

**Uso**: Valida la calidad y consistencia del código.

---

### `index.html`
**Función**: HTML base de la aplicación.

**Contiene**:
- Estructura HTML básica
- Div `#root` donde se monta React
- Meta tags

**Uso**: Punto de entrada HTML para la aplicación SPA.

---

## Punto de Entrada y App Principal

### `src/main.tsx`
**Función**: Punto de entrada de la aplicación React.

**Hace**:
1. Importa estilos globales (`index.css`, `App.css`)
2. Crea el root de React
3. Renderiza el componente `App`

**Uso**: Primer archivo que se ejecuta al cargar la aplicación.

---

### `src/App.tsx`
**Función**: Componente raíz de la aplicación que maneja el routing y estado global.

**Responsabilidades**:
- Manejo de autenticación (login/logout)
- Routing entre vistas (Dashboard, Reservas, Habitaciones, etc.)
- Estado global del usuario
- Configuración de React Query
- Manejo de check-in/check-out desde dashboard

**Uso**: Orquesta toda la aplicación y determina qué vista mostrar según el estado.

---

### `src/index.css`
**Función**: Estilos globales de la aplicación.

**Contiene**:
- Reset CSS
- Variables CSS personalizadas
- Estilos base de Tailwind
- Fuentes y tipografía base

**Uso**: Estilos que se aplican a toda la aplicación.

---

### `src/App.css`
**Función**: Estilos específicos del componente App.

**Uso**: Estilos adicionales para el layout principal.

---

### `src/vite-env.d.ts`
**Función**: Declaraciones de tipos para Vite.

**Uso**: Proporciona tipos TypeScript para variables de entorno de Vite (`import.meta.env`).

---

## Servicios y APIs

### `src/services/api.ts`
**Función**: Cliente Axios configurado con interceptores.

**Configura**:
- Base URL de la API
- Headers por defecto
- Interceptor para agregar token JWT
- Manejo de errores global

**Uso**: Cliente HTTP centralizado para todas las peticiones al backend.

---

### `src/services/types.ts`
**Función**: Definiciones de tipos TypeScript compartidos.

**Contiene**:
- Enums: `ReservationStatus`, `RoomType`, `PaymentMethod`, `UserRole`
- Interfaces: `Guest`, `Room`, `Reservation`, `User`, `LoginRequest`, etc.
- DTOs: `CreateReservationDTO`, `PaymentConfirmationDTO`, etc.

**Uso**: Tipos centralizados que se usan en toda la aplicación para type safety.

---

### `src/services/authApi.ts`
**Función**: Funciones para autenticación y gestión de usuarios.

**Funciones**:
- `login()`: Autenticación de usuario
- `getCurrentUser()`: Obtener usuario actual
- `createUser()`: Crear nuevo usuario (admin)
- `updateUser()`: Actualizar usuario
- `deleteUser()`: Eliminar usuario
- `getUsers()`: Listar usuarios

**Uso**: Todas las operaciones relacionadas con autenticación y usuarios.

---

### `src/services/reservationsApi.ts`
**Función**: Funciones para gestión de reservas.

**Funciones**:
- `getAll()`: Obtener todas las reservas
- `getById()`: Obtener reserva por ID
- `getActive()`: Obtener reservas activas
- `getPending()`: Obtener reservas pendientes
- `getToday()`: Obtener reservas del día
- `create()`: Crear nueva reserva
- `confirmPayment()`: Confirmar pago
- `cancel()`: Cancelar reserva
- `checkIn()`: Realizar check-in
- `checkOut()`: Realizar check-out
- `searchByNumber()`: Buscar por número de reserva

**Uso**: Todas las operaciones CRUD y de negocio relacionadas con reservas.

---

### `src/services/roomsApi.ts`
**Función**: Funciones para gestión de habitaciones.

**Funciones**:
- `getAll()`: Obtener todas las habitaciones
- `getById()`: Obtener habitación por ID
- `getAvailable()`: Obtener habitaciones disponibles
- `create()`: Crear nueva habitación
- `update()`: Actualizar habitación
- `delete()`: Eliminar habitación

**Uso**: Todas las operaciones CRUD relacionadas con habitaciones.

---

### `src/services/mockData.ts`
**Función**: Datos mock para desarrollo y testing.

**Uso**: Datos de prueba cuando el backend no está disponible (modo demo).

---

## Componentes de UI Base

### `src/components/ui/*.tsx`
**Función**: Componentes base de shadcn/ui reutilizables.

**Componentes principales**:

- **`button.tsx`**: Botones con variantes (default, outline, ghost, link)
- **`input.tsx`**: Inputs de texto con validación visual
- **`card.tsx`**: Tarjetas con header, content, footer
- **`dialog.tsx`**: Modales y diálogos
- **`select.tsx`**: Dropdowns personalizados
- **`badge.tsx`**: Badges para estados y etiquetas
- **`calendar.tsx`**: Componente de calendario
- **`form.tsx`**: Integración con React Hook Form
- **`toast.tsx`** (sonner.tsx): Notificaciones toast
- **`table.tsx`**: Tablas de datos
- **`tabs.tsx`**: Pestañas
- **`dialog.tsx`**: Diálogos modales
- **`dropdown-menu.tsx`**: Menús desplegables
- **`tooltip.tsx`**: Tooltips informativos
- **`skeleton.tsx`**: Placeholders de carga
- Y muchos más...

**Uso**: Componentes base que se usan en toda la aplicación para mantener consistencia visual.

---

### `src/components/ui/utils.ts`
**Función**: Utilidad `cn()` para combinar clases de Tailwind.

**Uso**: Función helper para mergear clases CSS de forma condicional.

---

### `src/components/ui/use-mobile.ts`
**Función**: Hook personalizado para detectar dispositivos móviles.

**Uso**: Determina si la aplicación se está ejecutando en un dispositivo móvil.

---

## Componentes Comunes

### `src/components/common/LoadingSpinner.tsx`
**Función**: Componente de spinner de carga reutilizable.

**Uso**: Muestra estado de carga en toda la aplicación.

---

### `src/components/common/HotelLogo.tsx`
**Función**: Componente del logo HOTEL.

**Uso**: Muestra el logo de la aplicación en Sidebar y Login.

---

### `src/components/common/Badge.tsx`
**Función**: Componente de badge personalizado (wrapper de shadcn/ui).

**Uso**: Badges para estados y etiquetas con estilos personalizados.

---

## Componentes de Layout

### `src/components/layout/Sidebar.tsx`
**Función**: Barra lateral de navegación.

**Contiene**:
- Logo de la aplicación
- Información del usuario (avatar, nombre, rol)
- Menú de navegación
- Botón de cerrar sesión

**Uso**: Navegación principal de la aplicación, visible en todas las vistas autenticadas.

---

## Componentes de Funcionalidades

### `src/components/LoginPage.tsx`
**Función**: Página de autenticación.

**Funcionalidades**:
- Formulario de login (usuario y contraseña)
- Validación de campos
- Manejo de errores específicos
- Integración con `authApi.login()`
- Redirección tras login exitoso

**Uso**: Primera pantalla que ve el usuario, punto de entrada a la aplicación.

---

### `src/components/dashboard/Dashboard.tsx`
**Función**: Dashboard principal con estadísticas y reservas del día.

**Contiene**:
- Cards de estadísticas (StatsCard)
- Lista de reservas del día (ReservationCard)
- Acciones rápidas (check-in/check-out)

**Uso**: Vista principal después del login, muestra resumen de la operación del día.

---

### `src/components/dashboard/StatsCard.tsx`
**Función**: Componente de tarjeta de estadística.

**Uso**: Muestra una métrica individual (reservas, check-ins, etc.) en el dashboard.

---

### `src/components/dashboard/ReservationCard.tsx`
**Función**: Componente de tarjeta de reserva para el dashboard.

**Uso**: Muestra información resumida de una reserva en el dashboard.

---

### `src/components/reservations/NewReservation.tsx`
**Función**: Formulario multi-paso para crear nueva reserva.

**Pasos**:
1. Datos del huésped
2. Fechas y número de huéspedes
3. Selección de habitación
4. Confirmación

**Uso**: Permite crear nuevas reservas con validación completa.

---

### `src/components/reservations/PendingReservations.tsx`
**Función**: Vista de reservas pendientes de pago.

**Funcionalidades**:
- Lista de reservas pendientes
- Confirmación de pago (modal)
- Cancelación de reservas
- Filtrado y búsqueda

**Uso**: Gestiona reservas que están esperando confirmación de pago.

---

### `src/components/reservations/SearchReservations.tsx`
**Función**: Búsqueda de reservas.

**Funcionalidades**:
- Búsqueda por número de reserva
- Búsqueda por nombre de huésped
- Búsqueda por rango de fechas
- Debounce en búsqueda

**Uso**: Permite encontrar reservas específicas rápidamente.

---

### `src/components/rooms/RoomsManagement.tsx`
**Función**: Gestión completa de habitaciones (CRUD).

**Funcionalidades**:
- Lista de habitaciones con imágenes
- Crear nueva habitación
- Editar habitación existente
- Eliminar habitación
- Filtrado por tipo y disponibilidad
- Búsqueda por número

**Uso**: Administración completa del catálogo de habitaciones.

---

### `src/components/calendar/ReservationsCalendar.tsx`
**Función**: Vista de calendario de reservas.

**Uso**: Muestra reservas en formato de calendario mensual.

---

### `src/components/calendar/ReservationsView.tsx`
**Función**: Vista detallada de reservas por fecha.

**Funcionalidades**:
- Agrupación de reservas por fecha
- Lista de check-ins del día
- Lista de check-outs del día
- Modal con detalles al hacer click

**Uso**: Vista alternativa para ver reservas organizadas por fecha.

---

### `src/components/users/UsersManagement.tsx`
**Función**: Gestión de usuarios (solo para administradores).

**Funcionalidades**:
- Lista de usuarios
- Crear nuevo usuario
- Editar usuario
- Eliminar usuario
- Filtrar por rol

**Uso**: Administración de usuarios del sistema (solo visible para administradores).

---

## Utilidades

### `src/utils/formatters.ts`
**Función**: Funciones de formateo de datos.

**Funciones**:
- `formatCurrency()`: Formatea números como moneda
- `formatDate()`: Formatea fechas
- `translateRoomType()`: Traduce tipos de habitación
- `translatePaymentMethod()`: Traduce métodos de pago
- `translateReservationStatus()`: Traduce estados de reserva

**Uso**: Utilidades para formatear datos antes de mostrarlos al usuario.

---

### `src/lib/utils.ts`
**Función**: Utilidades generales (similar a `components/ui/utils.ts`).

**Uso**: Funciones helper generales, principalmente `cn()` para clases CSS.

---

## Archivos Estáticos

### `public/logo.jpg`
**Función**: Logo de la aplicación HOTEL.

**Uso**: Se muestra en el Sidebar y en la página de Login.

---

### `public/Fondo.png`
**Función**: Imagen de fondo para la página de Login.

**Uso**: Fondo visual de la página de autenticación.

---

## Docker y Deployment

### `Dockerfile`
**Función**: Dockerfile para producción.

**Uso**: Construye imagen Docker optimizada para producción con Nginx.

---

### `Dockerfile.dev`
**Función**: Dockerfile para desarrollo.

**Uso**: Construye imagen Docker para entorno de desarrollo con hot-reload.

---

### `docker-compose.yml`
**Función**: Configuración de Docker Compose para producción.

**Uso**: Orquesta servicios para deployment en producción.

---

### `docker-compose.dev.yml`
**Función**: Configuración de Docker Compose para desarrollo.

**Uso**: Orquesta servicios para desarrollo local con hot-reload.

---

### `nginx.conf`
**Función**: Configuración de Nginx para servir la aplicación en producción.

**Uso**: Configura el servidor web que sirve los archivos estáticos compilados.

---

## Documentación

### `README.md`
**Función**: Documentación principal del proyecto.

**Contiene**:
- Descripción del proyecto
- Instrucciones de instalación
- Guía de uso
- Scripts disponibles

**Uso**: Primera referencia para nuevos desarrolladores.

---

### `docs/PROMPTS_CONSTRUCCION.md`
**Función**: Documentación de los prompts usados para construir el proyecto.

**Uso**: Referencia de cómo se construyó el proyecto usando ingeniería de prompts.

---

### `docs/HISTORIAS_USUARIO.md`
**Función**: Historias de usuario y requisitos del sistema.

**Uso**: Documentación de funcionalidades desde perspectiva de usuario.

---

### `docs/BACKEND_DIAGNOSTICO.md`
**Función**: Documentación del backend y diagnóstico.

**Uso**: Referencia técnica del backend.

---

### `src/Attributions.md`
**Función**: Atribuciones de librerías y recursos usados.

**Uso**: Créditos y licencias de dependencias.

---

## Flujo de la Aplicación

### 1. Inicio
```
index.html → main.tsx → App.tsx
```

### 2. Autenticación
```
App.tsx → LoginPage.tsx → authApi.login() → Dashboard
```

### 3. Navegación
```
Sidebar.tsx → Cambio de vista → Componente correspondiente
```

### 4. Operaciones
```
Componente → Service API → api.ts (Axios) → Backend
```

### 5. Estado
```
React Query → Cache de datos → Actualización automática
```

---

## Dependencias Clave

### React y Ecosystem
- **React 18.3+**: Framework principal
- **React Router DOM**: Routing
- **React Query**: Estado del servidor
- **React Hook Form**: Formularios

### UI y Estilos
- **Tailwind CSS**: Framework de estilos
- **shadcn/ui**: Componentes UI
- **Lucide React**: Iconos

### Utilidades
- **Axios**: Cliente HTTP
- **Sonner**: Notificaciones toast
- **Recharts**: Gráficos (si se usan)

---

## Estructura de Carpetas

```
src/
├── components/     # Componentes React
│   ├── ui/        # Componentes base de UI
│   ├── common/    # Componentes comunes
│   ├── layout/    # Componentes de layout
│   ├── dashboard/ # Componentes del dashboard
│   ├── reservations/ # Componentes de reservas
│   ├── rooms/     # Componentes de habitaciones
│   └── users/     # Componentes de usuarios
├── services/      # APIs y lógica de negocio
├── utils/         # Utilidades
└── lib/          # Librerías y helpers
```

---

**Última actualización**: Diciembre 2024  
**Versión del documento**: 1.0


