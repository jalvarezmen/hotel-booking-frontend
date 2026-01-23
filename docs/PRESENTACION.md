#  Presentación - Sistema de Reservas Hotel


---

## 📋 CONTEXTO Y DESAFÍO DE NEGOCIO

###  Introducción y Contexto

**Buenos días/tardes. Hoy presento el Sistema de Gestión de Reservas Hotel, una solución completa desarrollada con tecnologías modernas para optimizar las operaciones diarias de un hotel.**

**El desafío de negocio que enfrentamos era claro:**
- Los hoteles necesitan gestionar reservas de manera eficiente
- Requieren control de check-ins y check-outs en tiempo real
- Necesitan administrar su inventario de habitaciones
- Deben manejar múltiples roles de usuario (Administradores y Recepcionistas)
- Requieren un sistema que sea intuitivo, rápido y confiable

###  Problema a Resolver

**El problema principal era:**
- Sistemas legacy que no se adaptan a las necesidades actuales
- Falta de visibilidad en tiempo real del estado de las reservas
- Procesos manuales propensos a errores
- Dificultad para gestionar múltiples usuarios con diferentes permisos
- Necesidad de un sistema escalable y mantenible

### Solución Propuesta

**Nuestra solución es un sistema full-stack que incluye:**

**Backend:**
- API REST con Spring Boot 3.4.1
- Arquitectura en capas (Domain, Application, Infrastructure) con influencia de arquitectura limpia
- Seguridad con Spring Security y JWT
- Base de datos PostgreSQL 16
- Cobertura de tests del 85%

**Frontend:**
- Aplicación React con TypeScript
- Arquitectura Feature-Based
- UI moderna con Tailwind CSS y shadcn/ui
- Estado del servidor con React Query
- CI/CD completo con GitHub Actions

**El resultado:** Un sistema robusto, escalable y fácil de mantener que resuelve todos los desafíos planteados.

---

## DEEP DIVE DE INGENIERÍA

### Arquitectura del Backend

**Arquitectura en Capas (Layered Architecture) con tendencia a Clean Architecture:**

```
┌─────────────────────────────────────┐
│   Infrastructure Layer              │  ← Controllers, Security, Exceptions
├─────────────────────────────────────┤
│   Application Layer                 │  ← Services, DTOs, Business Logic
├─────────────────────────────────────┤
│   Domain Layer                      │  ← Entities, Repositories, Domain Logic
└─────────────────────────────────────┘
```

**Tecnologías Clave:**
- **Spring Boot 3.4.1** - Framework principal
- **Spring Security** - Autenticación y autorización
- **JWT (OAuth2 Resource Server)** - Tokens seguros
- **Spring Data JPA** - Abstracción de persistencia
- **PostgreSQL 16** - Base de datos relacional
- **Bean Validation** - Validación de datos

**Decisiones Arquitectónicas:**
1. **Separación de responsabilidades**: Cada capa tiene un propósito claro
2. **Domain-Driven Design**: El dominio está en el centro
3. **Repository Pattern**: Abstracción de acceso a datos
4. **Service Layer**: Lógica de negocio centralizada
5. **DTO Pattern**: Transferencia de datos optimizada

**Ejemplo de flujo:**
```
Request → Controller → Service → Repository → Database
         ↓
      Response ← DTO ← Entity ← JPA
```

### Arquitectura del Frontend

**Arquitectura Feature-Based + Layered:**

```
src/
├── components/          # Presentation Layer
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── dashboard/      # Feature: Dashboard
│   ├── reservations/   # Feature: Reservas
│   ├── rooms/          # Feature: Habitaciones
│   └── users/          # Feature: Usuarios
├── services/           # Service Layer
│   ├── api.ts         # Cliente HTTP centralizado
│   ├── authApi.ts     # Servicios de autenticación
│   └── [feature]Api.ts # Servicios por feature
└── utils/              # Utility Layer
```

**Stack Tecnológico:**
- **React 18.3** - Framework UI
- **TypeScript 5.3** - Type safety
- **Vite 6.3** - Build tool ultra-rápido
- **React Query 5.17** - Estado del servidor y cache
- **Tailwind CSS 3.4** - Estilos utility-first
- **shadcn/ui** - Componentes accesibles
- **Axios 1.6** - Cliente HTTP

**Patrones Implementados:**
1. **Feature-Based Organization**: Código agrupado por funcionalidad
2. **Component Composition**: Componentes reutilizables
3. **Custom Hooks**: Lógica reutilizable
4. **React Query**: Cache inteligente y sincronización

**Flujo de Datos:**
```
Usuario → Componente → React Query Hook
                          ↓
                    Service API → Axios → Backend
                          ↓
                    Cache Update → UI Re-render
```


###  Casos de Uso Técnicos Destacados

**1. Sistema de Reservas Completo:**
```
Crear Reserva → Validar Disponibilidad → Calcular Precio
     ↓
Confirmar Pago → Actualizar Estado → Notificar
```

**2. Gestión de Check-in/Check-out:**
- Validación de fechas
- Cálculo automático de noches
- Actualización de disponibilidad en tiempo real
- Manejo de estados (PENDING, CONFIRMED, ACTIVE, COMPLETED)

**3. Autenticación y Autorización:**
- Login con JWT
- Refresh tokens
- Protección de rutas
- Roles dinámicos (ADMINISTRADOR, RECEPCIONISTA)

**4. Dashboard en Tiempo Real:**
- Estadísticas actualizadas
- Reservas del día
- Acciones rápidas
- React Query con refetch automático

---

## CULTURA DEVOPS Y CALIDAD

### Testing y Cobertura

**Backend - Testing:**
- **Cobertura: 85%** (objetivo: 70%, superado)
- **Unit Tests**: Servicios y lógica de negocio
- **Integration Tests**: Controllers y endpoints
- **Repository Tests**: Acceso a datos
- **Herramientas**: JUnit 5, Mockito, H2 in-memory

**Tests Implementados:**
- `AuthServiceTest` - Autenticación y usuarios
- `ReservationServiceTest` - Lógica de reservas
- `RoomServiceTest` - Gestión de habitaciones
- `PaymentServiceTest` - Procesamiento de pagos
- `Controller Tests` - Endpoints REST
- `GlobalExceptionHandlerTest` - Manejo de errores

**Frontend - Quality Assurance:**
- **ESLint**: Validación de código (0 errores, 0 warnings)
- **TypeScript Strict Mode**: Type safety completo
- **Component Testing**: Preparado para React Testing Library
- **E2E Ready**: Playwright

### CI/CD Pipeline

**GitHub Actions Workflow:**

```yaml
Triggers:
  - Push a cualquier rama
  - Pull Request a main/develop

Jobs:
  1. Instalación de dependencias
  2. ESLint (validación de código)
  3. TypeScript (verificación de tipos)
  4. Build (compilación)
  5. Generación de artefactos
  6. Resumen con emojis
```


**Pipeline de Backend:**
- Compilación con Gradle
- Ejecución de tests
- Generación de reporte JaCoCo
- Validación de cobertura mas del 80%

### Docker y Containerización

**Backend:**
- Dockerfile multi-stage para optimización
- Docker Compose para desarrollo y producción
- PostgreSQL como servicio
- pgAdmin para administración
- Health checks configurados

**Frontend:**
- Dockerfile para producción con Nginx
- Dockerfile.dev para desarrollo con hot-reload
- Docker Compose para orquestación
- Configuración de Nginx optimizada

**Beneficios:**
- Desarrollo consistente entre equipos
- Deployment reproducible
- Escalabilidad horizontal
- Aislamiento de dependencias

###  Monitoreo y Calidad de Código

**Métricas de Calidad:**
- **Cobertura de Tests**: 85% (Backend)
- **Type Safety**: 100% (TypeScript strict)
- **Linting**: 0 errores, 0 warnings
- **Build Time**: < 30 segundos
- **Bundle Size**: Optimizado con code splitting

**Herramientas:**
- **JaCoCo**: Cobertura de código Java
- **ESLint**: Linting de JavaScript/TypeScript
- **TypeScript**: Verificación de tipos
- **Prettier**: Formato consistente (preparado)

**Prácticas Implementadas:**
- Code reviews obligatorios
- Pull request templates
- Branch protection rules
- Automated testing en CI/CD


---

## APRENDIZAJES Y CONCLUSIONES

### AI Collaboration Log

**"Durante el desarrollo, utilicé ingeniería de prompts estructurada para construir el proyecto. Esto me permitió:"**

**Metodología:**
- **+20 Prompts Estructurados**: Cada uno con rol, contexto, requisitos y validación
- **Desarrollo Iterativo**: Construcción paso a paso
- **Referencias Visuales**: Mockups como guía de diseño
- **Testing Continuo**: Tests desde el inicio, no al final

**Fases del Desarrollo:**
1. **Configuración Inicial** (Prompts 1-2)
2. **Arquitectura** (Prompts 3-4)
3. **Componentes Base** (Prompts 5-6)
4. **Funcionalidades Core** (Prompts 7-14)
5. **Testing y Calidad** (Prompts 15-18)
6. **CI/CD** (Prompts 19-20)

**Resultado:**
- Código limpio y mantenible
- Arquitectura sólida desde el inicio
- Testing integrado
- Documentación completa

### Aprendizajes Técnicos

**Backend:**
1. **Arquitectura en Capas**: Facilita mantenimiento y testing
2. **Spring Security**: Implementación robusta de seguridad
3. **JPA/Hibernate**: Optimización de queries es crucial
4. **Testing**: Cobertura alta mejora confianza en el código

**Frontend:**
1. **React Query**: Revoluciona el manejo de estado del servidor
2. **TypeScript Strict**: Previene errores en tiempo de desarrollo
3. **Feature-Based**: Escala mejor que organización por tipo
4. **shadcn/ui**: Componentes accesibles y personalizables

**DevOps:**
1. **CI/CD**: Automatización es esencial
2. **Docker**: Consistencia entre entornos
3. **GitHub Actions**: Potente y flexible
4. **Quality Gates**: Previenen problemas en producción

#
**Logros del Proyecto:**
✅ Sistema completo y funcional  
✅ Arquitectura escalable y mantenible  
✅ Cobertura de tests del 85% (superando el objetivo del 70%)  
✅ CI/CD completamente automatizado  
✅ Código limpio y documentado  
✅ Type safety completo  
✅ UI moderna y accesible  

**Métricas Finales:**
- **Backend**: 85% cobertura, 0 errores de compilación
- **Frontend**: 0 errores ESLint, 0 errores TypeScript
- **CI/CD**: 100% automatizado
- **Docker**: 100% containerizado



**"Este proyecto demuestra cómo la combinación de arquitectura sólida, testing riguroso, y colaboración efectiva con IA puede resultar en un sistema robusto, escalable y mantenible."**


---

