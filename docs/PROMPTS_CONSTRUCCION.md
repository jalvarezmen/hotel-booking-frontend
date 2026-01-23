# 🎯 Prompts de Construcción del Frontend - Sistema de Reservas Hotel

Este documento contiene una secuencia estructurada de prompts utilizados para construir el frontend del Sistema de Reservas Hotel, siguiendo principios de ingeniería de prompts y desarrollo iterativo.

---

## 📋 Índice

1. [Fase 1: Configuración Inicial](#fase-1-configuración-inicial)
2. [Fase 2: Arquitectura y Estructura](#fase-2-arquitectura-y-estructura)
3. [Fase 3: Componentes Base](#fase-3-componentes-base)
4. [Fase 4: Autenticación y Layout](#fase-4-autenticación-y-layout)
5. [Fase 5: Funcionalidades Core](#fase-5-funcionalidades-core)
6. [Fase 6: Testing y Calidad](#fase-6-testing-y-calidad)
7. [Fase 7: CI/CD y Deployment](#fase-7-cicd-y-deployment)

---

## Fase 1: Configuración Inicial

### Prompt 1: Setup del Proyecto Base

```
ROL: Eres un desarrollador frontend senior especializado en React, TypeScript y arquitectura de aplicaciones modernas.

CONTEXTO: Necesito crear un proyecto frontend para un sistema de gestión de reservas de hotel. 

REQUISITOS TÉCNICOS:
- Framework: React 18.3+ con TypeScript
- Build Tool: Vite 6.3+
- Estilos: Tailwind CSS 3.4+ con configuración personalizada
- UI Components: shadcn/ui (instalación completa)
- Estado: TanStack Query (React Query) 5.17+ para manejo de estado del servidor
- Routing: React Router DOM 6.22+
- HTTP Client: Axios 1.6+
- Notificaciones: Sonner 2.0+
- Formularios: React Hook Form 7.55+

ENTREGABLES:
1. Estructura de carpetas siguiendo arquitectura por features
2. Configuración de TypeScript estricto
3. Configuración de Tailwind con tema personalizado (colores beige/naranja)
4. Configuración de ESLint y Prettier
5. Variables de entorno para API base URL

VALIDACIÓN:
- El proyecto debe compilar sin errores
- ESLint debe pasar sin warnings
- TypeScript debe estar en modo estricto
```

### Prompt 2: Configuración de Tema y Estilos

```
ROL: Eres un diseñador UI/UX y desarrollador frontend especializado en sistemas de diseño y Tailwind CSS.

CONTEXTO: Basándome en el mockup proporcionado (imagen: hotel-theme-reference.png), necesito configurar el sistema de diseño del frontend.

REFERENCIA VISUAL:
- Mockup muestra paleta de colores: beige (#FAF8F5), naranja (#FF6B35), marrón oscuro (#3E2723)
- Tipografía: Sans-serif moderna, cursiva para títulos principales
- Espaciado: Generoso, diseño limpio y minimalista

REQUISITOS:
1. Configurar variables CSS personalizadas en Tailwind
2. Crear archivo de tema con colores primarios, secundarios, y estados
3. Configurar tipografía con pesos: light (300), normal (400), medium (500), semibold (600)
4. Establecer sistema de espaciado consistente
5. Configurar modo oscuro (opcional pero preparado)

ARCHIVOS A CREAR:
- tailwind.config.js con tema personalizado
- src/index.css con variables CSS
- src/App.css con estilos globales

VALIDACIÓN:
- Los colores deben coincidir exactamente con el mockup
- El sistema debe ser escalable para nuevos componentes
```

---

## Fase 2: Arquitectura y Estructura

### Prompt 3: Definición de Arquitectura de Carpetas

```
ROL: Eres un arquitecto de software frontend especializado en Clean Architecture, SOLID principles y escalabilidad de aplicaciones React.

CONTEXTO: Necesito establecer la arquitectura de carpetas del proyecto siguiendo principios de Clean Architecture y Feature-Based Structure.

ARQUITECTURA REQUERIDA:
```
src/
├── components/        # Componentes reutilizables
│   ├── common/       # Componentes comunes (LoadingSpinner, etc.)
│   ├── ui/           # Componentes UI de shadcn/ui
│   ├── layout/       # Componentes de layout (Sidebar, Header)
│   ├── dashboard/    # Componentes del dashboard
│   ├── reservations/  # Componentes de reservas
│   ├── rooms/        # Componentes de habitaciones
│   └── users/        # Componentes de usuarios
├── services/         # Lógica de negocio y APIs
│   ├── api.ts        # Cliente Axios configurado
│   ├── authApi.ts    # Endpoints de autenticación
│   ├── reservationsApi.ts
│   ├── roomsApi.ts
│   └── types.ts      # Tipos TypeScript compartidos
├── utils/            # Utilidades
│   └── formatters.ts # Funciones de formateo
└── hooks/            # Custom hooks (si se necesitan)
```

REQUISITOS:
1. Separación clara entre presentación y lógica
2. Tipos TypeScript centralizados en services/types.ts
3. Componentes UI reutilizables en components/ui/
4. Cada feature tiene su propia carpeta en components/

VALIDACIÓN:
- Estructura debe ser escalable
- No debe haber dependencias circulares
- Cada módulo debe ser independiente
```

### Prompt 4: Configuración de TypeScript Estricto

```
ROL: Eres un desarrollador TypeScript senior especializado en type safety, configuración de compiladores y mejores prácticas de TypeScript.

CONTEXTO: Configura TypeScript en modo estricto para el proyecto, asegurando type safety completo.

CONFIGURACIÓN REQUERIDA:
- strict: true
- noImplicitAny: true
- strictNullChecks: true
- strictFunctionTypes: true
- noUnusedLocals: true
- noUnusedParameters: true
- noImplicitReturns: true
- noFallthroughCasesInSwitch: true

ARCHIVOS:
- tsconfig.json (configuración base)
- tsconfig.node.json (configuración para Vite)

VALIDACIÓN:
- El proyecto debe compilar sin errores
- Todos los tipos deben estar explícitamente definidos
- No debe haber uso de 'any' sin justificación
```

---

## Fase 3: Componentes Base

### Prompt 5: Implementación de Componentes UI Base

```
ROL: Eres un desarrollador de componentes UI especializado en shadcn/ui, accesibilidad (WCAG), y diseño de sistemas de componentes reutilizables.

CONTEXTO: Basándome en el mockup de componentes UI (imagen: ui-components-reference.png), implementa los componentes base de shadcn/ui necesarios.

COMPONENTES REQUERIDOS:
1. Button (variantes: default, outline, ghost, link)
2. Input (con validación visual)
3. Card (con header, content, footer)
4. Dialog/Modal (para confirmaciones)
5. Select (dropdown personalizado)
6. Badge (para estados)
7. Toast/Notification (usando Sonner)
8. LoadingSpinner (componente personalizado)

REQUISITOS DE DISEÑO:
- Deben seguir el sistema de colores del tema
- Bordes redondeados (rounded-xl)
- Sombras sutiles (shadow-md)
- Transiciones suaves (transition-all duration-200)
- Estados hover y focus bien definidos

VALIDACIÓN:
- Cada componente debe tener TypeScript types completos
- Debe ser accesible (ARIA labels)
- Debe ser responsive
- Debe funcionar en modo oscuro (si aplica)
```

### Prompt 6: Componente de Loading y Estados Vacíos

```
ROL: Eres un desarrollador frontend especializado en UX patterns, estados de carga, y diseño de componentes de feedback visual.

CONTEXTO: Crea componentes reutilizables para estados de carga y estados vacíos.

COMPONENTES:
1. LoadingSpinner
   - Animación suave
   - Tamaños: sm, md, lg
   - Color del tema (naranja)

2. EmptyState
   - Icono ilustrativo
   - Título y descripción
   - Botón de acción opcional

3. ErrorState
   - Mensaje de error claro
   - Botón de reintento
   - Icono de error

REQUISITOS:
- Componentes deben ser flexibles y reutilizables
- Deben seguir el diseño del sistema
- Deben ser accesibles

VALIDACIÓN:
- Componentes deben renderizar correctamente
- Deben tener tests unitarios básicos
```

---

## Fase 4: Autenticación y Layout

### Prompt 7: Página de Login con Diseño Específico

```
ROL: Eres un desarrollador frontend y diseñador UI especializado en páginas de autenticación, seguridad web, y implementación fiel de mockups.

CONTEXTO: Basándome en el mockup de login proporcionado (imagen: login-mockup.png), implementa la página de autenticación.

DISEÑO ESPECÍFICO DEL MOCKUP:
- Fondo: Imagen de hotel con blur y overlay oscuro
- Card central: Fondo semi-transparente (bg-gray-900/30) con backdrop-blur
- Logo: Cuadrado dorado con icono de edificio (o logo HOTEL proporcionado)
- Título: "Sistema de Reservas" en cursiva, tamaño 3xl, color gris claro
- Subtítulo: "Acceso exclusivo para personal" en cursiva, tamaño sm
- Inputs: Fondo claro, bordes redondeados, placeholder visible
- Botón: Gradiente naranja a rojo, texto blanco, bordes redondeados

FUNCIONALIDAD:
1. Validación de campos (usuario y contraseña requeridos)
2. Manejo de errores con mensajes específicos
3. Loading state durante autenticación
4. Integración con authApi.login()
5. Redirección al dashboard tras login exitoso
6. Manejo de token JWT (almacenamiento en localStorage)

VALIDACIÓN:
- Debe coincidir exactamente con el mockup
- Debe validar inputs antes de enviar
- Debe mostrar errores específicos (usuario incorrecto vs contraseña incorrecta)
- Debe manejar estados de carga correctamente
```

### Prompt 8: Layout Principal con Sidebar

```
ROL: Eres un desarrollador frontend especializado en layouts complejos, navegación, responsive design, y arquitectura de componentes de layout.

CONTEXTO: Crea el layout principal de la aplicación con sidebar basado en el mockup (imagen: layout-mockup.png).

COMPONENTES REQUERIDOS:
1. Sidebar (fijo a la izquierda)
   - Logo HOTEL en la parte superior
   - Información del usuario (avatar, nombre, rol)
   - Menú de navegación con iconos
   - Botón de cerrar sesión

2. Main Content Area
   - Área de contenido principal
   - Responsive (sidebar colapsa en móvil)

3. Header (opcional, si está en el mockup)
   - Breadcrumbs
   - Acciones rápidas

DISEÑO DEL MOCKUP:
- Sidebar: Fondo blanco, ancho 256px, borde derecho sutil
- Logo: Componente HotelLogo con imagen logo.jpg
- Menú: Items con iconos, estado activo destacado (gradiente naranja)
- Usuario: Avatar circular con inicial, nombre y rol debajo

FUNCIONALIDAD:
1. Navegación entre vistas
2. Estado activo del menú
3. Cerrar sesión con confirmación
4. Responsive design

VALIDACIÓN:
- Debe coincidir con el mockup
- Navegación debe funcionar correctamente
- Debe ser responsive
```

---

## Fase 5: Funcionalidades Core

### Prompt 9: Dashboard Principal

```
ROL: Eres un desarrollador frontend especializado en dashboards, visualización de datos, React Query, y componentes de estadísticas en tiempo real.

CONTEXTO: Implementa el dashboard principal basado en el mockup (imagen: dashboard-mockup.png).

COMPONENTES REQUERIDOS:
1. Cards de Estadísticas
   - Reservas del día
   - Check-ins pendientes
   - Check-outs pendientes
   - Ocupación actual

2. Lista de Reservas del Día
   - Cards con información de reserva
   - Acciones rápidas (check-in, check-out)
   - Estados visuales (pendiente, confirmada, activa)

3. Gráfico de Ocupación (opcional)
   - Usando Recharts
   - Vista semanal/mensual

DISEÑO DEL MOCKUP:
- Grid de 2 columnas para stats
- Cards con iconos, números grandes, y variación porcentual
- Lista de reservas con cards horizontales
- Colores del tema aplicados consistentemente

FUNCIONALIDAD:
1. Carga de datos con React Query
2. Actualización en tiempo real (refetch cada 30s)
3. Acciones rápidas desde el dashboard
4. Manejo de estados de carga y error

VALIDACIÓN:
- Debe cargar datos correctamente
- Debe actualizar automáticamente
- Las acciones deben funcionar
- Debe manejar errores gracefully
```

### Prompt 10: Gestión de Reservas - Nueva Reserva

```
ROL: Eres un desarrollador frontend especializado en formularios complejos, multi-step forms, validación de datos, React Hook Form, y UX de formularios.

CONTEXTO: Implementa el formulario de nueva reserva basado en el mockup (imagen: new-reservation-mockup.png).

DISEÑO DEL MOCKUP:
- Formulario multi-paso (stepper)
- Paso 1: Datos del huésped (nombre, apellido, documento, email, teléfono)
- Paso 2: Fechas y número de huéspedes (calendario, input numérico)
- Paso 3: Selección de habitación (filtros por tipo, capacidad, precio)
- Paso 4: Confirmación y resumen

FUNCIONALIDAD:
1. Validación en cada paso
2. Navegación entre pasos
3. Filtrado de habitaciones en tiempo real
4. Cálculo automático de precio total
5. Envío de reserva al backend
6. Manejo de errores específicos

VALIDACIÓN:
- Cada campo debe validarse antes de avanzar
- El formulario debe prevenir envíos inválidos
- Debe mostrar errores específicos por campo
- Debe calcular correctamente el total
```

### Prompt 11: Gestión de Reservas - Lista de Pendientes

```
ROL: Eres un desarrollador frontend especializado en listas complejas, filtrado, búsqueda, modales de confirmación, y gestión de estado con React Query.

CONTEXTO: Implementa la vista de reservas pendientes basada en el mockup (imagen: pending-reservations-mockup.png).

COMPONENTES:
1. Lista de Reservas
   - Cards con información completa
   - Estados visuales (badges)
   - Acciones: Confirmar pago, Cancelar

2. Dialog de Confirmación de Pago
   - Método de pago (Efectivo, Tarjeta, Transferencia)
   - Monto y referencia
   - Validación de campos

3. Dialog de Cancelación
   - Campo de razón
   - Confirmación de penalización/reembolso

DISEÑO DEL MOCKUP:
- Grid de cards responsive
- Información clara y organizada
- Botones de acción visibles

FUNCIONALIDAD:
1. Carga de reservas pendientes
2. Filtrado y búsqueda
3. Confirmación de pago
4. Cancelación con razón
5. Actualización en tiempo real

VALIDACIÓN:
- Debe cargar todas las reservas pendientes
- Las acciones deben funcionar correctamente
- Debe validar formularios antes de enviar
```

### Prompt 12: Gestión de Habitaciones

```
ROL: Eres un desarrollador frontend especializado en CRUD operations, gestión de imágenes, validación de formularios, y operaciones de datos complejas.

CONTEXTO: Implementa la gestión de habitaciones basada en el mockup (imagen: rooms-management-mockup.png).

COMPONENTES:
1. Lista de Habitaciones
   - Grid de cards con imagen
   - Información: número, tipo, capacidad, precio
   - Estado de disponibilidad
   - Acciones: Editar, Eliminar

2. Formulario de Creación/Edición
   - Número de habitación
   - Tipo (Standard, Superior, Deluxe, Suite)
   - Capacidad (input numérico manual)
   - Precio por noche (input numérico manual con decimales)
   - URL de imagen (opcional)

DISEÑO DEL MOCKUP:
- Cards con imágenes de habitaciones
- Badges de estado (disponible, ocupada, mantenimiento)
- Formulario en modal/dialog

FUNCIONALIDAD:
1. CRUD completo de habitaciones
2. Validación de datos
3. Carga de imágenes
4. Filtrado por tipo y disponibilidad
5. Búsqueda por número

VALIDACIÓN:
- CRUD debe funcionar correctamente
- Validaciones deben prevenir datos inválidos
- Imágenes deben cargarse correctamente
```

### Prompt 13: Búsqueda de Reservas

```
ROL: Eres un desarrollador frontend especializado en búsqueda en tiempo real, debouncing, filtrado avanzado, y optimización de performance en búsquedas.

CONTEXTO: Implementa la funcionalidad de búsqueda de reservas basada en el mockup (imagen: search-reservations-mockup.png).

COMPONENTES:
1. Barra de Búsqueda
   - Input con icono de búsqueda
   - Filtros: Por número, por huésped, por fecha
   - Botón de búsqueda

2. Resultados
   - Lista de reservas encontradas
   - Información detallada
   - Acciones rápidas

FUNCIONALIDAD:
1. Búsqueda por número de reserva
2. Búsqueda por nombre de huésped
3. Búsqueda por rango de fechas
4. Debounce en búsqueda (300ms)
5. Manejo de "no encontrado"

VALIDACIÓN:
- Búsqueda debe ser rápida y precisa
- Debe manejar casos sin resultados
- Debe mostrar loading durante búsqueda
```

### Prompt 14: Calendario de Reservas

```
ROL: Eres un desarrollador frontend especializado en componentes de calendario, visualización de datos temporales, agrupación de datos, y librerías como react-day-picker.

CONTEXTO: Implementa la vista de calendario de reservas basada en el mockup (imagen: calendar-mockup.png).

COMPONENTES:
1. Calendario Mensual
   - Vista de mes con días destacados
   - Indicadores de check-ins y check-outs
   - Navegación entre meses

2. Vista de Detalles del Día
   - Lista de check-ins del día
   - Lista de check-outs del día
   - Información detallada de cada reserva

DISEÑO DEL MOCKUP:
- Calendario visual con colores
- Días con eventos marcados
- Modal con detalles al hacer click

FUNCIONALIDAD:
1. Carga de reservas activas
2. Agrupación por fecha
3. Navegación entre meses
4. Vista detallada al hacer click

VALIDACIÓN:
- Debe mostrar correctamente las fechas
- Debe agrupar reservas por día
- La navegación debe funcionar
```

---

## Fase 6: Testing y Calidad

### Prompt 15: Configuración de Testing

```
ROL: Eres un ingeniero de QA y desarrollador especializado en testing de aplicaciones React, Vitest, React Testing Library, y MSW para mocks de API.

CONTEXTO: Configura el entorno de testing para el proyecto con las siguientes herramientas.

HERRAMIENTAS REQUERIDAS:
- Vitest (testing framework)
- React Testing Library (testing de componentes)
- MSW (Mock Service Worker para mocks de API)
- @testing-library/user-event (simulación de interacciones)

CONFIGURACIÓN:
1. Setup de Vitest con configuración para React
2. Configuración de MSW para interceptar requests
3. Helpers de testing reutilizables
4. Mocks de datos de prueba

ESTRUCTURA:
```
src/
├── __tests__/
│   ├── setup.ts
│   └── mocks/
│       ├── handlers.ts
│       └── server.ts
└── components/
    └── __tests__/
```

VALIDACIÓN:
- Los tests deben ejecutarse correctamente
- MSW debe interceptar requests
- Helpers deben ser reutilizables
```

### Prompt 16: Tests Unitarios de Componentes Críticos

```
ROL: Eres un ingeniero de QA senior especializado en testing unitario, cobertura de código, casos edge, y mejores prácticas de testing en React.

CONTEXTO: Escribe tests unitarios completos para los componentes críticos de la aplicación.

COMPONENTES A TESTEAR:
1. LoginPage
   - Renderizado correcto
   - Validación de campos
   - Manejo de errores
   - Redirección tras login exitoso

2. NewReservation (formulario multi-paso)
   - Navegación entre pasos
   - Validación de cada paso
   - Cálculo de totales
   - Envío de formulario

3. RoomsManagement
   - CRUD de habitaciones
   - Validación de formularios
   - Filtrado y búsqueda

COBERTURA MÍNIMA:
- 70% de cobertura de código
- Todos los casos edge deben estar cubiertos
- Tests deben ser rápidos (< 100ms cada uno)

VALIDACIÓN:
- Todos los tests deben pasar
- Cobertura debe ser >= 70%
- Tests deben ser mantenibles
```

### Prompt 17: Tests de Integración de Flujos Completos

```
ROL: Eres un ingeniero de QA senior especializado en testing de integración, end-to-end testing, simulación de flujos de usuario, y MSW para mocks avanzados.

CONTEXTO: Escribe tests de integración para los flujos completos de la aplicación.

FLUJOS A TESTEAR:
1. Flujo de Autenticación Completo
   - Login exitoso
   - Login con credenciales incorrectas
   - Logout
   - Persistencia de sesión

2. Flujo de Creación de Reserva
   - Llenado de datos del huésped
   - Selección de fechas
   - Selección de habitación
   - Confirmación y creación

3. Flujo de Gestión de Habitaciones
   - Crear habitación
   - Editar habitación
   - Eliminar habitación
   - Validar disponibilidad

REQUISITOS:
- Usar MSW para mocks de API
- Simular interacciones de usuario completas
- Verificar cambios en el estado de la aplicación
- Verificar llamadas a la API

VALIDACIÓN:
- Todos los flujos deben pasar
- Deben simular comportamiento real
- Deben ser independientes entre sí
```

### Prompt 18: Validación de ESLint y TypeScript Estricto

```
ROL: Eres un code reviewer senior y arquitecto de software especializado en estándares de código, linting, type safety, y calidad de código.

CONTEXTO: Asegura que todo el código cumpla con los estándares de calidad establecidos.

REQUISITOS:
1. ESLint
   - 0 errores
   - 0 warnings (o warnings justificados)
   - Reglas estrictas activadas
   - No usar 'any' sin justificación

2. TypeScript
   - Modo estricto activado
   - Todos los tipos explícitos
   - No hay tipos 'any'
   - No hay imports no utilizados

3. Código
   - Formato consistente (Prettier)
   - Nombres descriptivos
   - Funciones pequeñas y enfocadas
   - Comentarios donde sea necesario

ARCHIVOS DE CONFIGURACIÓN:
- .eslintrc.cjs (configuración estricta)
- tsconfig.json (strict mode)
- .prettierrc (formato consistente)

VALIDACIÓN:
- npm run lint debe pasar sin errores
- npx tsc --noEmit debe pasar sin errores
- Código debe ser legible y mantenible
```

---

## Fase 7: CI/CD y Deployment

### Prompt 19: Configuración de GitHub Actions para CI/CD

```
ROL: Eres un DevOps engineer y especialista en CI/CD especializado en GitHub Actions, pipelines de integración continua, y automatización de workflows.

CONTEXTO: Crea un workflow de GitHub Actions para CI/CD del frontend.

REQUISITOS DEL WORKFLOW:
1. Triggers
   - Push a cualquier rama
   - Pull Request a main y develop

2. Jobs
   - Instalación de dependencias (npm ci)
   - Linting (ESLint)
   - Type Checking (TypeScript)
   - Build (npm run build)
   - Tests (si existen)

3. Validaciones
   - PRs a main/develop: Validaciones bloqueantes
   - Push a otras ramas: Validaciones informativas

4. Artefactos
   - Subir build resultante
   - Retención de 7 días

5. Resumen
   - Generar resumen con emojis
   - Mostrar estado de cada validación
   - Mensajes claros y descriptivos

ARCHIVO:
- .github/workflows/ci-cd.yml

VALIDACIÓN:
- El workflow debe ejecutarse correctamente
- Debe fallar si hay errores en PRs a main/develop
- Debe generar artefactos correctamente
```

### Prompt 20: Optimización y Mejoras Finales

```
ROL: Eres un performance engineer y desarrollador frontend senior especializado en optimización de React, bundle optimization, accesibilidad (WCAG), y métricas de performance (Lighthouse).

CONTEXTO: Realiza optimizaciones finales y mejoras de rendimiento del frontend.

OPTIMIZACIONES REQUERIDAS:
1. Performance
   - Code splitting por rutas
   - Lazy loading de componentes pesados
   - Optimización de imágenes
   - Memoización de componentes costosos

2. Accesibilidad
   - ARIA labels en todos los componentes interactivos
   - Navegación por teclado funcional
   - Contraste de colores adecuado
   - Screen reader friendly

3. SEO (si aplica)
   - Meta tags apropiados
   - Títulos descriptivos
   - Estructura semántica HTML

4. Bundle Size
   - Análisis del bundle
   - Eliminación de dependencias no usadas
   - Tree shaking verificado

VALIDACIÓN:
- Lighthouse score >= 90 en todas las categorías
- Bundle size < 500KB (gzipped)
- Tiempo de carga inicial < 2s
- Todos los componentes accesibles
```

---

### Estructura de Prompts

Cada prompt sigue esta estructura:
1. **ROL**: Especialización y expertise del asistente para ese prompt específico
2. **Contexto**: Situación y objetivo
3. **Requisitos Técnicos**: Herramientas y tecnologías específicas
4. **Referencias Visuales**: Mockups e imágenes proporcionadas
5. **Entregables**: Qué se espera recibir
6. **Validación**: Criterios de éxito medibles

### Principios Aplicados

- **Especificidad**: Cada prompt es muy específico en lo que requiere
- **Iteratividad**: Los prompts se construyen unos sobre otros
- **Validación**: Cada fase tiene criterios de validación claros
- **Referencias Visuales**: Uso constante de mockups para guiar el diseño
- **Testing Continuo**: Testing integrado desde el inicio, no al final



