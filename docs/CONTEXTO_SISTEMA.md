# CONTEXTO_SISTEMA.md

**Documento técnico de referencia** para mantener coherencia arquitectónica del proyecto.  
**Propósito**: Guía definitiva para consulta por IAs y desarrolladores para preservar patrones y convenciones.

---

## 🎯 Identidad del Proyecto

**Nombre del Sistema**: Hotel Booking API  
**Nombre Técnico**: `hotel-booking-api`  
**Organización**: `com.sofka.hotel_booking_api`

**Tipo de Sistema**: API REST para gestión de reservas de hotel  
**Dominio de Negocio**: Sistema de gestión hotelera orientado a recepcionistas y administradores  
**Características Principales**:
- Motor de reservas con validación de disponibilidad
- Gestión de habitaciones e inventario
- Registro manual de pagos (efectivo, tarjeta, transferencia)
- Proceso de check-in/check-out
- Política de cancelación con cálculo automático de reembolsos

**Audiencia Objetivo**: 
- Recepcionistas del hotel (operaciones diarias)
- Administradores del hotel (gestión completa)

**Estado Actual**: Sistema en desarrollo activo, autenticación deshabilitada para facilitar desarrollo

---

## 💻 Stack Tecnológico

### Lenguaje y Runtime
- **Lenguaje**: Java 17 (LTS)
- **JDK**: OpenJDK 17 (toolchain configurado en Gradle)
- **Paradigma**: Orientado a objetos con uso extensivo de programación funcional (Streams, Records)

### Framework Principal
- **Framework**: Spring Boot 3.4.1
- **Gestor de Dependencias**: Gradle (con wrapper)
- **Servidor Embebido**: Tomcat Embedded (incluido en Spring Boot)
- **Puerto Predeterminado**: 8080

### Persistencia y Base de Datos
- **ORM**: Hibernate (a través de Spring Data JPA)
- **Motor de Base de Datos**: PostgreSQL 16 (Alpine)
- **Driver JDBC**: PostgreSQL Driver (`org.postgresql:postgresql`)
- **Modo DDL**: `update` (Hibernate genera/esquema actualiza automáticamente)
- **Dialecto**: `org.hibernate.dialect.PostgreSQLDialect`

### Seguridad
- **Framework de Seguridad**: Spring Security
- **Mecanismo de Autenticación**: [Pendiente de definir por el usuario]
  - OAuth2 Resource Server está en dependencias pero no activo
  - Configuración actual: `.permitAll()` (todas las rutas abiertas para desarrollo)
- **CORS**: Configurado para permitir `localhost:5173`, `localhost:3000`, `localhost:80`

### Validación
- **Framework**: Jakarta Bean Validation (`spring-boot-starter-validation`)
- **Anotaciones Principales**: `@NotNull`, `@NotBlank`, `@Size`, `@Min`, `@Max`, `@DecimalMin`, `@Email`, `@Pattern`, `@Valid`

### Testing
- **Framework**: JUnit 5 (Jupiter)
- **Cobertura de Código**: JaCoCo 0.8.11
  - Servicios de aplicación: mínimo 70% cobertura
  - Modelos con lógica de negocio: mínimo 50% cobertura
- **Base de Datos de Pruebas**: H2 (en memoria)

### Calidad de Código
- **Análisis Estático**: Checkstyle 10.12.5 (temporalmente deshabilitado)

### Containerización
- **Orquestación**: Docker Compose
- **Imagen Base API**: [Pendiente de definir por el usuario - Dockerfile en hotel-booking-api/]
- **Red**: Docker bridge network (`hotel-network`)

---

## 🏗️ Arquitectura y Flujo

### Patrón Arquitectónico
**Arquitectura en Capas (Layered Architecture)** con influencias de **Clean Architecture** y principios de **Inversión de Dependencias**.

### Separación de Capas

```
┌─────────────────────────────────────┐
│   INFRASTRUCTURE (Presentación)     │
│   - Controllers (REST endpoints)    │
│   - DTOs (Request/Response)         │
│   - Exception Handlers              │
└──────────────┬──────────────────────┘
               │ depende de
┌──────────────▼──────────────────────┐
│   APPLICATION (Capa de Servicio)    │
│   - Services (Lógica de negocio)    │
│   - Orquestación de casos de uso    │
└──────────────┬──────────────────────┘
               │ depende de
┌──────────────▼──────────────────────┐
│   DOMAIN (Núcleo del Negocio)       │
│   - Entities (Modelos JPA)          │
│   - Repository Interfaces           │
│   - Domain Exceptions               │
└─────────────────────────────────────┘
```

### Flujo de una Petición HTTP

```
1. HTTP Request → Controller (@RestController)
   ↓
2. Validación de DTO (@Valid, Bean Validation)
   ↓
3. Controller delega a Service (Application Layer)
   ↓
4. Service orquesta lógica de negocio:
   - Valida reglas de negocio (RN-XXX)
   - Consulta Repositories (Domain Layer)
   - Aplica transformaciones
   ↓
5. Repository (Spring Data JPA) → Hibernate → PostgreSQL
   ↓
6. Service retorna entidad de dominio
   ↓
7. Service transforma a DTO (Response)
   ↓
8. Controller retorna ResponseEntity con DTO
   ↓
9. GlobalExceptionHandler intercepta excepciones:
   - Domain Exceptions → HTTP Status Codes
   - Validation Errors → 400 con detalles por campo
   ↓
10. HTTP Response (JSON)
```

### Convenciones de Estructura de Paquetes

```
com.sofka.hotel_booking_api
├── application/
│   └── service/           # Servicios de aplicación (casos de uso)
├── config/                 # Configuración de Spring (Security, CORS, Beans)
├── domain/
│   ├── exception/         # Excepciones de dominio (business exceptions)
│   ├── model/             # Entidades JPA (domain entities)
│   └── repository/        # Interfaces de repositorio (Spring Data JPA)
├── infrastructure/
│   ├── constants/         # Constantes del sistema
│   ├── controller/        # Controladores REST
│   ├── dto/               # Data Transfer Objects (Request/Response)
│   └── exception/         # Manejadores de excepciones HTTP
└── HotelBookingApiApplication.java
```

### Principios de Diseño Aplicados

1. **Separación de Responsabilidades (SRP)**: Cada capa tiene una responsabilidad única
2. **Inversión de Dependencias (DIP)**: Domain no depende de Infrastructure
3. **DTO Pattern**: Separación entre entidades de dominio y objetos de transferencia
4. **Repository Pattern**: Abstracción de acceso a datos
5. **Service Layer Pattern**: Lógica de negocio encapsulada en servicios
6. **Exception Handling Strategy**: Excepciones de dominio → excepciones HTTP estructuradas

---

## 🔒 Reglas de Oro (Constraints)

### 1. Uso Obligatorio de DTOs para Transferencia de Datos
**Regla**: Los controllers **NUNCA** deben exponer directamente entidades de dominio. Siempre usar DTOs (`Request` y `Response`) ubicados en `infrastructure.dto`.

**Justificación**: 
- Protege el modelo de dominio de cambios en la API
- Permite versionado independiente
- Evita exposición accidental de campos sensibles

**Ejemplo Correcto**:
```java
@PostMapping
public ResponseEntity<ReservationResponse> createReservation(
    @Valid @RequestBody CreateReservationRequest request) {
    ReservationResponse response = reservationService.createReservation(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}
```

**Ejemplo Incorrecto**:
```java
@PostMapping
public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation) {
    // ❌ Expone entidad de dominio directamente
}
```

---

### 2. Validación con Bean Validation en DTOs
**Regla**: Todos los DTOs de entrada (`Request`) deben usar anotaciones de Jakarta Bean Validation (`@NotNull`, `@NotBlank`, `@Size`, `@Min`, `@Max`, `@Email`, etc.) y ser validados con `@Valid` en los parámetros del controller.

**Justificación**: 
- Validación declarativa y consistente
- Mensajes de error estructurados
- Reducción de código boilerplate

**Ejemplo Correcto**:
```java
public record CreateReservationRequest(
    @Valid @NotNull CreateGuestRequest guest,
    @NotNull Long roomId,
    @NotNull LocalDate checkInDate,
    @NotNull LocalDate checkOutDate,
    @NotNull @Min(1) @Max(10) Integer numberOfGuests
) {}
```

**Mensajes de Validación**: Centralizados en `infrastructure.constants.ValidationMessages` cuando son reutilizables.

---

### 3. Manejo Centralizado de Excepciones
**Regla**: Todas las excepciones deben ser manejadas por `GlobalExceptionHandler` ubicado en `infrastructure.exception`. Las excepciones de dominio deben lanzarse como tipos específicos (ej: `RoomNotFoundException`, `ReservationNotFoundException`) y nunca como excepciones genéricas.

**Justificación**:
- Respuestas HTTP consistentes y estructuradas
- Códigos de estado HTTP apropiados
- Trazabilidad y debugging facilitados

**Mapeo de Excepciones**:
- `DuplicateRoomNumberException` → `409 Conflict`
- `RoomNotFoundException` → `404 Not Found`
- `ReservationNotFoundException` → `404 Not Found`
- `InvalidDateRangeException` → `400 Bad Request`
- `IllegalStateException` → `400 Bad Request` (operaciones no permitidas)
- `IllegalArgumentException` → `400 Bad Request` (datos inválidos)
- `MethodArgumentNotValidException` → `400 Bad Request` (validación de campos)

**Formato de Respuesta de Error**:
```json
{
  "status": 400,
  "error": "Título del error",
  "message": "Descripción detallada",
  "timestamp": "2026-01-21T00:00:00"
}
```

**Para Errores de Validación**:
```json
{
  "status": 400,
  "error": "Errores de validación",
  "validationErrors": {
    "campo": "mensaje de error"
  },
  "timestamp": "2026-01-21T00:00:00"
}
```

---

### 4. Transacciones en Servicios de Aplicación
**Regla**: Todos los métodos de servicios en `application.service` que modifican datos deben estar anotados con `@Transactional`. Los métodos de solo lectura deben usar `@Transactional(readOnly = true)`.

**Justificación**:
- Consistencia de datos garantizada
- Optimización de queries en modo lectura
- Gestión automática de rollback en caso de error

**Ejemplo Correcto**:
```java
@Transactional
public ReservationResponse createReservation(CreateReservationRequest request) {
    // Lógica que modifica datos
}

@Transactional(readOnly = true)
public List<ReservationResponse> searchReservations(String reservationNumber, String guestName) {
    // Solo consultas
}
```

---

### 5. Referencias a Reglas de Negocio en Código
**Regla**: Todas las validaciones y lógica de negocio deben hacer referencia explícita a las reglas de negocio documentadas (formato: `RN-XXX`) mediante comentarios JavaDoc o comentarios inline.

**Justificación**:
- Trazabilidad entre código y documentación de negocio
- Facilita mantenimiento y cambios de reglas
- Documentación viva del código

**Ejemplo Correcto**:
```java
/**
 * Valida que las fechas de la reserva sean válidas.
 * RN-004: Validaciones de Reserva
 */
private void validateDates(LocalDate checkInDate, LocalDate checkOutDate) {
    // Implementación
}
```

**Ubicación de Reglas**: Documentadas en `docs/REGLAS_NEGOCIO.md`

---

## 📡 Catálogo de Endpoints

### Base URL
```
http://localhost:8080/api
```

### Prefijo Común
Todos los endpoints están bajo el prefijo `/api`

---

### 🔹 Gestión de Habitaciones (`/api/rooms`)

| Método | Ruta | Descripción | Carga Útil | Respuesta |
|--------|------|-------------|------------|-----------|
| **POST** | `/api/rooms` | Registrar nueva habitación | `CreateRoomRequest` | `RoomResponse` (201) |
| **GET** | `/api/rooms` | Obtener todas las habitaciones | - | `List<RoomResponse>` (200) |
| **GET** | `/api/rooms/{id}` | Obtener habitación por ID | - | `RoomResponse` (200) |
| **PUT** | `/api/rooms/{id}` | Actualizar habitación existente | `CreateRoomRequest` | `RoomResponse` (200) |
| **DELETE** | `/api/rooms/{id}` | Eliminar habitación | - | - (204) |
| **GET** | `/api/rooms/available` | Consultar habitaciones disponibles | Query: `checkIn`, `checkOut`, `roomType?` | `List<RoomResponse>` (200) |

**Query Params para `/available`**:
- `checkIn` (obligatorio): `LocalDate` formato ISO (YYYY-MM-DD)
- `checkOut` (obligatorio): `LocalDate` formato ISO (YYYY-MM-DD)
- `roomType` (opcional): `STANDARD | SUPERIOR | DELUXE | SUITE`

---

### 🔹 Gestión de Reservas (`/api/reservations`)

| Método | Ruta | Descripción | Carga Útil | Respuesta |
|--------|------|-------------|------------|-----------|
| **POST** | `/api/reservations` | Crear nueva reserva | `CreateReservationRequest` | `ReservationResponse` (201) |
| **POST** | `/api/reservations/{id}/confirm-payment` | Confirmar pago de reserva | `ConfirmPaymentRequest` | - (200) |
| **GET** | `/api/reservations/search` | Buscar reservas por criterios | Query: `reservationNumber?`, `guestName?` | `List<ReservationResponse>` (200) |
| **GET** | `/api/reservations/today` | Obtener reservas del día actual | - | `TodayReservationsResponse` (200) |
| **POST** | `/api/reservations/{id}/check-in` | Realizar check-in de reserva | - | - (200) |
| **POST** | `/api/reservations/{id}/check-out` | Realizar check-out de reserva | - | - (200) |
| **POST** | `/api/reservations/{id}/cancel` | Cancelar reserva | `CancelReservationRequest` | `CancelReservationResponse` (200) |

**Query Params para `/search`**:
- `reservationNumber` (opcional): Búsqueda exacta por número de reserva
- `guestName` (opcional): Búsqueda parcial (case-insensitive) por nombre o apellido

**Validaciones Importantes**:
- Búsqueda requiere al menos un parámetro (reservationNumber o guestName)
- Check-in solo permite fechas del día actual
- Check-in requiere estado `CONFIRMED` previamente
- Check-out requiere estado `ACTIVE` (check-in realizado)

---

### 📋 Estructura de DTOs Principales

#### `CreateReservationRequest`
```java
{
  "guest": {
    "firstName": "string (2-100 chars, obligatorio)",
    "lastName": "string (2-100 chars, obligatorio)",
    "documentNumber": "string (5-50 chars, obligatorio)",
    "email": "string (formato email válido, obligatorio)",
    "phone": "string (formato: +?[0-9\\s\\-()]{7,20}, obligatorio)"
  },
  "roomId": "long (obligatorio)",
  "checkInDate": "LocalDate (ISO YYYY-MM-DD, obligatorio)",
  "checkOutDate": "LocalDate (ISO YYYY-MM-DD, obligatorio)",
  "numberOfGuests": "integer (1-10, obligatorio)"
}
```

#### `CreateRoomRequest`
```java
{
  "roomNumber": "string (obligatorio, no vacío)",
  "roomType": "STANDARD | SUPERIOR | DELUXE | SUITE (obligatorio)",
  "capacity": "integer (1-10, obligatorio)",
  "pricePerNight": "decimal (min: 0.01, obligatorio)"
}
```

#### `ConfirmPaymentRequest`
```java
{
  "paymentMethod": "string (obligatorio, no vacío)",
  "amount": "decimal (min: 0.01, obligatorio)",
  "reference": "string (opcional, puede ser requerido según método)"
}
```

#### `CancelReservationRequest`
```java
{
  "reason": "string (obligatorio, no vacío, max: 500 chars)"
}
```

---

### 📊 Enums del Sistema

#### `RoomType`
- `STANDARD` - Estándar
- `SUPERIOR` - Superior
- `DELUXE` - Deluxe
- `SUITE` - Suite

#### `ReservationStatus`
- `PENDING` - Pendiente (creada, esperando pago)
- `CONFIRMED` - Confirmada (pago realizado)
- `ACTIVE` - Activa (check-in realizado)
- `COMPLETED` - Completada (check-out realizado)
- `CANCELLED` - Cancelada
- `EXPIRED` - Expirada (sin pago en 24 horas)

**Transiciones de Estado Válidas**:
```
PENDING → CONFIRMED → ACTIVE → COMPLETED
PENDING → CANCELLED | EXPIRED
CONFIRMED → CANCELLED
ACTIVE → CANCELLED (excepcional)
```

---

## 📝 Convenciones de Código

### Nomenclatura
- **Clases**: PascalCase (ej: `ReservationService`, `RoomController`)
- **Métodos**: camelCase (ej: `createReservation`, `getAvailableRooms`)
- **Variables**: camelCase (ej: `reservationId`, `numberOfGuests`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `ROOM_NUMBER_REQUIRED`)
- **Paquetes**: lowercase con separación por puntos (ej: `com.sofka.hotel_booking_api`)
- **Tablas de BD**: snake_case (ej: `reservations`, `room_number`)
- **Columnas de BD**: snake_case (ej: `check_in_date`, `total_amount`)

### Estructura de Archivos
- Un archivo por clase/interface (convención Java estándar)
- DTOs como Records (Java 14+) cuando es posible
- Entidades como clases JPA con getters/setters
- Servicios como clases con `@Service`

### Comentarios y Documentación
- JavaDoc en todas las clases públicas y métodos públicos
- Referencias a reglas de negocio en formato `RN-XXX`
- Comentarios inline para lógica compleja
- Historial de cambios en documentos markdown principales

### Manejo de Fechas
- **Formato API**: ISO 8601 (`YYYY-MM-DD` para LocalDate, `YYYY-MM-DDTHH:mm:ss` para LocalDateTime)
- **Tipo de Datos**: `java.time.LocalDate` y `java.time.LocalDateTime` (Java 8+ Time API)
- **Zona Horaria**: [Pendiente de definir por el usuario - actualmente usa zona horaria del servidor]

### Manejo de Decimales
- **Tipo de Datos**: `java.math.BigDecimal` para montos monetarios
- **Precisión**: `precision=10, scale=2` en base de datos
- **Formato JSON**: String o número decimal con punto como separador

---

## 🔗 Referencias Técnicas

### Documentación Interna
- **Reglas de Negocio**: `docs/REGLAS_NEGOCIO.md`
- **Historias de Usuario**: `docs/HISTORIAS_USUARIO.md`
- **Diagnóstico Backend**: `hotel-booking-api/BACKEND_DIAGNOSTICO.md` (si existe)

### Recursos Externos
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [Jakarta Bean Validation](https://beanvalidation.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## ⚠️ Notas Importantes

1. **Autenticación**: Actualmente deshabilitada para desarrollo. Para producción se requiere implementar OAuth2 + JWT según comentarios en `SecurityConfig`.

2. **CORS**: Configurado para desarrollo. Revisar configuración para producción.

3. **Base de Datos**: Hibernate en modo `update` puede modificar esquema. Para producción considerar `validate` o migraciones con Flyway/Liquibase.

4. **Validación de Reglas de Negocio**: Las reglas están documentadas en `docs/REGLAS_NEGOCIO.md`. Cualquier cambio en reglas debe reflejarse en código y documentación.

5. **Cobertura de Tests**: El proyecto exige 70% en servicios y 50% en modelos. Verificar con `./gradlew test jacocoTestReport`.

---

**Última Actualización**: Enero 2026  
**Versión del Documento**: 1.0  
**Mantenido por**: Equipo de Desarrollo

