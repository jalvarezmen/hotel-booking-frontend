# 🔍 Diagnóstico del Backend - Hotel Booking API

**Generado por:** Análisis arquitectónico del repositorio  
**Fecha:** Enero 2026  
**Versión de la API:** 0.0.1-SNAPSHOT

---

## 📋 Tabla de Contenidos

1. [Resumen de Arquitectura](#resumen-de-arquitectura)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Catálogo de Endpoints](#catálogo-de-endpoints)
5. [Guía de Integración](#guía-de-integración)

---

## 🏗️ Resumen de Arquitectura

El proyecto implementa una **Arquitectura en Capas (Layered Architecture)** con influencias de **Clean Architecture**. La estructura sigue el principio de separación de responsabilidades dividiendo el código en tres capas principales:

### Capas Identificadas:

1. **Capa de Dominio (`domain/`)**:
   - Contiene las entidades de negocio (modelos)
   - Define las interfaces de repositorio (contratos)
   - Aloja las excepciones de dominio
   - **Característica**: No depende de ninguna otra capa (principio de inversión de dependencias)

2. **Capa de Aplicación (`application/`)**:
   - Contiene los servicios de aplicación que orquestan la lógica de negocio
   - Define los casos de uso del sistema
   - **Característica**: Depende solo de la capa de dominio

3. **Capa de Infraestructura (`infrastructure/`)**:
   - Controladores REST que exponen la API
   - DTOs para la transferencia de datos
   - Implementación del manejo de excepciones HTTP
   - **Característica**: Depende de las capas de dominio y aplicación

4. **Capa de Configuración (`config/`)**:
   - Configuración de Spring Security
   - Configuración CORS
   - Bean definitions

### Patrón de Diseño Detectado:
- **Repository Pattern**: Interfaces en dominio, implementaciones por Spring Data JPA
- **DTO Pattern**: Separación entre entidades de dominio y objetos de transferencia
- **Service Layer Pattern**: Lógica de negocio encapsulada en servicios

---

## 💻 Stack Tecnológico

### Lenguaje y Framework Base
- **Lenguaje**: Java 17
- **Framework**: Spring Boot 3.4.1
- **Gestor de Dependencias**: Gradle

### Base de Datos
- **Motor**: PostgreSQL 16
- **ORM**: Hibernate (a través de Spring Data JPA)
- **Driver**: PostgreSQL JDBC Driver

### Seguridad y Autenticación
- **Framework**: Spring Security
- **Protocolo OAuth2**: Spring Boot Starter OAuth2 Resource Server
- **Estado Actual**: Autenticación deshabilitada para desarrollo (configuración `permitAll()`)

### Validación
- **Librería**: Jakarta Bean Validation (`spring-boot-starter-validation`)
- **Anotaciones utilizadas**: `@Valid`, `@NotNull`, `@NotBlank`, `@Size`, `@Email`, `@Min`, `@Max`, `@DecimalMin`, `@Pattern`

### Testing
- **Framework**: JUnit 5
- **Cobertura**: JaCoCo (configurado con 70% mínimo en servicios, 50% en modelos)
- **BD de Pruebas**: H2 (en memoria)

### Calidad de Código
- **Análisis Estático**: Checkstyle 10.12.5 (actualmente deshabilitado temporalmente)

### Servidor Web
- **Puerto**: 8080 (configurable)
- **Contenedor**: Tomcat Embedded (incluido en Spring Boot)

---

## 📁 Estructura de Carpetas

```
hotel-booking-api/
├── src/
│   ├── main/
│   │   ├── java/com/sofka/hotel_booking_api/
│   │   │   ├── application/              # Capa de Aplicación
│   │   │   │   └── service/              # Servicios de lógica de negocio
│   │   │   │       ├── GuestService.java
│   │   │   │       ├── PaymentService.java
│   │   │   │       ├── ReservationService.java
│   │   │   │       └── RoomService.java
│   │   │   │
│   │   │   ├── config/                   # Configuración del sistema
│   │   │   │   └── SecurityConfig.java   # Configuración de seguridad y CORS
│   │   │   │
│   │   │   ├── domain/                   # Capa de Dominio
│   │   │   │   ├── exception/            # Excepciones de negocio
│   │   │   │   │   ├── DuplicateRoomNumberException.java
│   │   │   │   │   ├── InvalidDateRangeException.java
│   │   │   │   │   ├── ReservationNotFoundException.java
│   │   │   │   │   └── RoomNotFoundException.java
│   │   │   │   ├── model/                # Entidades de dominio
│   │   │   │   │   ├── Guest.java
│   │   │   │   │   ├── Reservation.java
│   │   │   │   │   ├── ReservationStatus.java (enum)
│   │   │   │   │   ├── Room.java
│   │   │   │   │   └── RoomType.java (enum)
│   │   │   │   └── repository/           # Interfaces de repositorio
│   │   │   │       ├── GuestRepository.java
│   │   │   │       ├── ReservationRepository.java
│   │   │   │       └── RoomRepository.java
│   │   │   │
│   │   │   ├── infrastructure/           # Capa de Infraestructura
│   │   │   │   ├── constants/            # Constantes del sistema
│   │   │   │   │   └── ValidationMessages.java
│   │   │   │   ├── controller/           # Controladores REST
│   │   │   │   │   ├── ReservationController.java
│   │   │   │   │   └── RoomController.java
│   │   │   │   ├── dto/                  # Data Transfer Objects
│   │   │   │   │   ├── CancelReservationRequest.java
│   │   │   │   │   ├── CancelReservationResponse.java
│   │   │   │   │   ├── ConfirmPaymentRequest.java
│   │   │   │   │   ├── CreateGuestRequest.java
│   │   │   │   │   ├── CreateReservationRequest.java
│   │   │   │   │   ├── CreateRoomRequest.java
│   │   │   │   │   ├── GuestResponse.java
│   │   │   │   │   ├── ReservationResponse.java
│   │   │   │   │   ├── RoomResponse.java
│   │   │   │   │   └── TodayReservationsResponse.java
│   │   │   │   └── exception/            # Manejo de excepciones HTTP
│   │   │   │       └── GlobalExceptionHandler.java
│   │   │   │
│   │   │   └── HotelBookingApiApplication.java  # Clase principal Spring Boot
│   │   │
│   │   └── resources/
│   │       ├── application.yaml          # Configuración de la aplicación
│   │       └── db/
│   │           └── init.sql              # Scripts de inicialización de BD
│   │
│   └── test/                              # Tests unitarios e integración
│
└── build.gradle                           # Configuración de Gradle
```

### Descripción de Directorios Principales:

- **`application/service/`**: Contiene la lógica de negocio orquestada. Los servicios coordinan entre repositorios y aplican reglas de negocio.

- **`domain/model/`**: Entidades JPA que representan el modelo de datos. Incluyen anotaciones de JPA y validaciones de negocio.

- **`domain/repository/`**: Interfaces que extienden `JpaRepository`. Spring Data JPA proporciona implementaciones automáticas.

- **`infrastructure/controller/`**: Endpoints REST que exponen la API. Reciben DTOs, delegan a servicios y retornan respuestas HTTP.

- **`infrastructure/dto/`**: Objetos de transferencia de datos. Separan el modelo de dominio de la capa de presentación.

- **`infrastructure/exception/`**: Manejador global que convierte excepciones de dominio en respuestas HTTP estructuradas.

- **`config/`**: Configuración centralizada de Spring (seguridad, CORS, beans).

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

| Método | Ruta | Descripción | Carga Útil (Request Body) | Respuesta |
|--------|------|-------------|---------------------------|-----------|
| **POST** | `/api/rooms` | Registrar una nueva habitación | `CreateRoomRequest` | `RoomResponse` (201 Created) |
| **GET** | `/api/rooms` | Obtener todas las habitaciones | - | `List<RoomResponse>` (200 OK) |
| **GET** | `/api/rooms/{id}` | Obtener una habitación por ID | - | `RoomResponse` (200 OK) |
| **PUT** | `/api/rooms/{id}` | Actualizar una habitación existente | `CreateRoomRequest` | `RoomResponse` (200 OK) |
| **DELETE** | `/api/rooms/{id}` | Eliminar una habitación | - | - (204 No Content) |
| **GET** | `/api/rooms/available` | Consultar habitaciones disponibles | Query Params: `checkIn`, `checkOut`, `roomType?` | `List<RoomResponse>` (200 OK) |

#### Detalles de `CreateRoomRequest`:
```json
{
  "roomNumber": "string (obligatorio, no vacío)",
  "roomType": "STANDARD | SUPERIOR | DELUXE | SUITE (obligatorio)",
  "capacity": "integer (obligatorio, min: 1, max: 10)",
  "pricePerNight": "decimal (obligatorio, min: 0.01)"
}
```

#### Detalles de `RoomResponse`:
```json
{
  "id": "long",
  "roomNumber": "string",
  "roomType": "STANDARD | SUPERIOR | DELUXE | SUITE",
  "capacity": "integer",
  "pricePerNight": "decimal",
  "isAvailable": "boolean"
}
```

#### Query Params para `/api/rooms/available`:
- `checkIn` (obligatorio): `LocalDate` formato ISO (YYYY-MM-DD)
- `checkOut` (obligatorio): `LocalDate` formato ISO (YYYY-MM-DD)
- `roomType` (opcional): `STANDARD | SUPERIOR | DELUXE | SUITE`

---

### 🔹 Gestión de Reservas (`/api/reservations`)

| Método | Ruta | Descripción | Carga Útil (Request Body) | Respuesta |
|--------|------|-------------|---------------------------|-----------|
| **POST** | `/api/reservations` | Crear una nueva reserva | `CreateReservationRequest` | `ReservationResponse` (201 Created) |
| **POST** | `/api/reservations/{id}/confirm-payment` | Confirmar pago de una reserva | `ConfirmPaymentRequest` | - (200 OK) |
| **GET** | `/api/reservations/search` | Buscar reservas por criterios | Query Params: `reservationNumber?`, `guestName?` | `List<ReservationResponse>` (200 OK) |
| **GET** | `/api/reservations/today` | Obtener reservas del día actual | - | `TodayReservationsResponse` (200 OK) |
| **POST** | `/api/reservations/{id}/check-in` | Realizar check-in de una reserva | - | - (200 OK) |
| **POST** | `/api/reservations/{id}/check-out` | Realizar check-out de una reserva | - | - (200 OK) |
| **POST** | `/api/reservations/{id}/cancel` | Cancelar una reserva | `CancelReservationRequest` | `CancelReservationResponse` (200 OK) |

#### Detalles de `CreateReservationRequest`:
```json
{
  "guest": {
    "firstName": "string (obligatorio, 2-100 caracteres)",
    "lastName": "string (obligatorio, 2-100 caracteres)",
    "documentNumber": "string (obligatorio, 5-50 caracteres)",
    "email": "string (obligatorio, formato email válido)",
    "phone": "string (obligatorio, formato: +?[0-9\\s\\-()]{7,20})"
  },
  "roomId": "long (obligatorio)",
  "checkInDate": "LocalDate (obligatorio, formato ISO YYYY-MM-DD)",
  "checkOutDate": "LocalDate (obligatorio, formato ISO YYYY-MM-DD)",
  "numberOfGuests": "integer (obligatorio, min: 1, max: 10)"
}
```

#### Detalles de `ConfirmPaymentRequest`:
```json
{
  "paymentMethod": "string (obligatorio, no vacío)",
  "amount": "decimal (obligatorio, min: 0.01)",
  "reference": "string (opcional, puede ser requerido según método de pago)"
}
```

#### Detalles de `CancelReservationRequest`:
```json
{
  "reason": "string (obligatorio, no vacío, max: 500 caracteres)"
}
```

#### Detalles de `ReservationResponse`:
```json
{
  "id": "long",
  "reservationNumber": "string",
  "guest": {
    "id": "long",
    "firstName": "string",
    "lastName": "string",
    "documentNumber": "string",
    "email": "string",
    "phone": "string"
  },
  "room": {
    "id": "long",
    "roomNumber": "string",
    "roomType": "STANDARD | SUPERIOR | DELUXE | SUITE",
    "capacity": "integer",
    "pricePerNight": "decimal",
    "isAvailable": "boolean"
  },
  "checkInDate": "LocalDate",
  "checkOutDate": "LocalDate",
  "numberOfGuests": "integer",
  "numberOfNights": "long",
  "totalAmount": "decimal",
  "status": "PENDING | CONFIRMED | ACTIVE | COMPLETED | CANCELLED | EXPIRED",
  "createdAt": "LocalDateTime",
  "checkInTime": "LocalDateTime (nullable)",
  "checkOutTime": "LocalDateTime (nullable)"
}
```

#### Detalles de `TodayReservationsResponse`:
```json
{
  "checkIns": ["List<ReservationResponse>"],
  "checkOuts": ["List<ReservationResponse>"]
}
```

#### Detalles de `CancelReservationResponse`:
```json
{
  "reservationNumber": "string",
  "status": "CANCELLED",
  "refundAmount": "decimal (si aplica)",
  "penaltyAmount": "decimal (si aplica)",
  "cancellationReason": "string"
}
```

#### Query Params para `/api/reservations/search`:
- `reservationNumber` (opcional): Búsqueda exacta por número de reserva
- `guestName` (opcional): Búsqueda parcial (case-insensitive) por nombre o apellido del huésped

---

### Enums Importantes

#### `RoomType`:
- `STANDARD` - Estándar
- `SUPERIOR` - Superior
- `DELUXE` - Deluxe
- `SUITE` - Suite

#### `ReservationStatus`:
- `PENDING` - Pendiente (creada pero sin pago)
- `CONFIRMED` - Confirmada (pago realizado)
- `ACTIVE` - Activa (check-in realizado)
- `COMPLETED` - Completada (check-out realizado)
- `CANCELLED` - Cancelada
- `EXPIRED` - Expirada (sin pago en 24 horas)

---

## 🔌 Guía de Integración

### Autenticación

**⚠️ IMPORTANTE**: Actualmente la autenticación está **deshabilitada** para desarrollo. Todos los endpoints son accesibles sin credenciales.

**Configuración Actual:**
- Spring Security está configurado con `.permitAll()` para todas las rutas
- Spring Boot Starter OAuth2 Resource Server está incluido pero no activo
- **Estado**: No detectado en el repositorio como implementación de producción

**Para Producción:**
Según comentarios en `SecurityConfig.java`, se debe implementar:
- OAuth2 + JWT para autenticación
- Configuración de tokens y validación de endpoints protegidos
- Actualmente no implementado

**CORS Configurado:**
Los siguientes orígenes están permitidos:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server alternativo)
- `http://localhost:80` (Nginx producción)

**Métodos HTTP Permitidos:**
- GET, POST, PUT, PATCH, DELETE, OPTIONS

**Headers Permitidos:**
- Todos los headers (`*`)

**Credentials:**
- Permitidos (`allowCredentials: true`)

---

### Manejo de Errores

El sistema utiliza un **manejador global de excepciones** (`GlobalExceptionHandler`) que transforma excepciones de dominio y validaciones en respuestas HTTP estructuradas.

#### Formato de Respuesta de Error Simple:

**Código HTTP**: Varía según el tipo de error

**Cuerpo de Respuesta:**
```json
{
  "status": 400,
  "error": "Título del error",
  "message": "Descripción detallada del error",
  "timestamp": "2026-01-21T00:00:00"
}
```

#### Formato de Respuesta de Error de Validación:

**Código HTTP**: `400 Bad Request`

**Cuerpo de Respuesta:**
```json
{
  "status": 400,
  "error": "Error de validación",
  "validationErrors": {
    "campo1": "Mensaje de error del campo 1",
    "campo2": "Mensaje de error del campo 2"
  },
  "timestamp": "2026-01-21T00:00:00"
}
```

#### Mapeo de Excepciones a Códigos HTTP:

| Excepción de Dominio | Código HTTP | Título del Error |
|---------------------|-------------|------------------|
| `DuplicateRoomNumberException` | `409 Conflict` | "Número de habitación duplicado" |
| `RoomNotFoundException` | `404 Not Found` | "Habitación no encontrada" |
| `ReservationNotFoundException` | `404 Not Found` | "Reserva no encontrada" |
| `InvalidDateRangeException` | `400 Bad Request` | "Rango de fechas inválido" |
| `IllegalStateException` | `400 Bad Request` | "Operación no permitida" |
| `IllegalArgumentException` | `400 Bad Request` | "Datos inválidos" |
| `MethodArgumentNotValidException` | `400 Bad Request` | "Error de validación" |

#### Ejemplos de Respuestas de Error:

**Ejemplo 1: Validación de Campos**
```json
{
  "status": 400,
  "error": "Error de validación",
  "validationErrors": {
    "email": "El correo electrónico debe tener un formato válido",
    "numberOfGuests": "Debe haber al menos 1 huésped"
  },
  "timestamp": "2026-01-21T12:00:00"
}
```

**Ejemplo 2: Recurso No Encontrado**
```json
{
  "status": 404,
  "error": "Reserva no encontrada",
  "message": "No se encontró una reserva con ID: 999",
  "timestamp": "2026-01-21T12:00:00"
}
```

**Ejemplo 3: Conflicto**
```json
{
  "status": 409,
  "error": "Número de habitación duplicado",
  "message": "Ya existe una habitación con el número: 101",
  "timestamp": "2026-01-21T12:00:00"
}
```

---

### Recomendaciones para el Frontend

1. **Manejo de Errores**:
   - Siempre verificar el código de estado HTTP antes de procesar la respuesta
   - Para errores 400 con `validationErrors`, mostrar los mensajes junto a cada campo
   - Para errores 404, mostrar mensaje amigable al usuario
   - Para errores 409, informar sobre el conflicto y sugerir acciones

2. **Formatos de Fecha**:
   - Usar formato ISO 8601 para fechas: `YYYY-MM-DD`
   - Ejemplo: `"2026-01-21"`

3. **Formatos de Decimal**:
   - Usar punto (`.`) como separador decimal
   - Ejemplo: `"150.50"`

4. **Validación en Frontend**:
   - Aunque el backend valida, implementar validación en frontend para mejor UX
   - Usar los mismos patrones de validación que el backend

5. **Headers HTTP**:
   - Content-Type: `application/json` para todas las peticiones POST/PUT
   - Accept: `application/json` para todas las peticiones

6. **CORS**:
   - Si el frontend corre en un puerto diferente a los configurados, será necesario actualizar `SecurityConfig.java`

---

## 📝 Notas Adicionales

### Configuración de Base de Datos

**Variables de Entorno** (usadas en docker-compose.yml):
- `SPRING_DATASOURCE_URL`: URL de conexión a PostgreSQL
- `SPRING_DATASOURCE_USERNAME`: Usuario de la base de datos
- `SPRING_DATASOURCE_PASSWORD`: Contraseña de la base de datos
- `SPRING_JPA_HIBERNATE_DDL_AUTO`: Modo de creación de esquema (por defecto: `update`)

**Por defecto en desarrollo local:**
- URL: `jdbc:postgresql://localhost:5432/hotel_booking`
- Usuario: `hotel_admin`
- Contraseña: `hotel_password`

### Reglas de Negocio Importantes

1. **Tiempo de Confirmación de Pago (RN-003)**: Las reservas tienen 24 horas para confirmar el pago antes de expirar.

2. **Capacidad de Habitaciones (RN-005)**: El número de huéspedes no puede exceder la capacidad de la habitación.

3. **Validación de Fechas (RN-004)**: La fecha de check-out debe ser posterior a la fecha de check-in.

4. **Número de Habitación Único (RN-006)**: No pueden existir dos habitaciones con el mismo número.

---

## 🔗 Recursos Adicionales

- **Documentación Spring Boot**: https://spring.io/projects/spring-boot
- **Documentación Spring Security**: https://spring.io/projects/spring-security
- **Documentación PostgreSQL**: https://www.postgresql.org/docs/

---

**Fin del Diagnóstico**

