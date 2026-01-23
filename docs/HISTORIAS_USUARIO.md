# Historias de Usuario - Frontend Sistema de Reservas de Hotel

**Usuarios principales:** Recepcionista y Administrador del hotel

---

## Épica 1: Autenticación y Gestión de Usuarios

### Historia 1.1: Iniciar sesión en el sistema
**Como** empleado del hotel (recepcionista o administrador)  
**Quiero** iniciar sesión con mis credenciales  
**Para** acceder a las funcionalidades del sistema según mi rol

**Criterios de aceptación:**
- Debo poder ingresar mi usuario y contraseña
- El sistema debe validar mis credenciales
- Debo ser redirigido al dashboard después de un inicio exitoso
- Mi sesión debe persistir mientras navego por la aplicación
- Debo poder cerrar sesión de forma segura

#### Escenarios Gherkin:

```gherkin
Escenario: Inicio de sesión exitoso
  Dado que soy un usuario registrado con rol "Recepcionista"
  Cuando ingreso mi usuario y contraseña correctos
  Y hago clic en "Iniciar Sesión"
  Entonces accedo al sistema
  Y veo el dashboard correspondiente a mi rol
  Y mi sesión permanece activa durante mi navegación

Escenario: Inicio de sesión con credenciales inválidas
  Dado que intento acceder al sistema
  Cuando ingreso una contraseña incorrecta
  Y hago clic en "Iniciar Sesión"
  Entonces recibo un mensaje indicando que las credenciales son inválidas
  Y no puedo acceder al sistema
  Y permanezco en la página de login

Escenario: Inicio de sesión con campos vacíos
  Dado que estoy en la página de login
  Cuando intento iniciar sesión sin completar los campos
  Entonces el formulario me indica que los campos son obligatorios
  Y no puedo enviar el formulario

Escenario: Cierre de sesión
  Dado que tengo una sesión activa en el sistema
  Cuando selecciono la opción de cerrar sesión
  Entonces mi sesión se termina de forma segura
  Y soy redirigido a la página de inicio de sesión
  Y recibo un mensaje confirmando el cierre de sesión
```

### Historia 1.2: Crear usuario empleado
**Como** administrador del hotel  
**Quiero** crear cuentas de usuario para los empleados  
**Para** que puedan acceder al sistema según su rol asignado

**Criterios de aceptación:**
- Solo los administradores pueden acceder a esta funcionalidad
- Debo poder ingresar nombre, cargo, usuario, contraseña, celular, DNI y rol
- El sistema debe validar que los campos obligatorios estén completos
- Debo recibir confirmación cuando el usuario se crea exitosamente

#### Escenarios Gherkin:

```gherkin
Escenario: Creación exitosa de usuario recepcionista
  Dado que soy un administrador y accedo al módulo de gestión de usuarios
  Cuando creo un nuevo usuario con nombre "Ana López", cargo "Recepcionista", usuario "ana.lopez", contraseña "password123", celular "+57 300 1234567", DNI "12345678" y rol "Recepcionista"
  Y hago clic en "Crear"
  Entonces el usuario queda registrado en el sistema
  Y recibo un mensaje de éxito
  Y el nuevo usuario aparece en la lista de usuarios

Escenario: Creación exitosa de usuario administrador
  Dado que soy un administrador y accedo al módulo de gestión de usuarios
  Cuando creo un nuevo usuario con rol "Administrador"
  Y completo todos los campos obligatorios
  Y hago clic en "Crear"
  Entonces el usuario queda registrado con permisos completos
  Y puede gestionar habitaciones, reportes y otros usuarios

Escenario: Intento de crear usuario con campos obligatorios vacíos
  Dado que soy un administrador y accedo al módulo de gestión de usuarios
  Cuando intento crear un usuario sin completar los campos obligatorios
  Y hago clic en "Crear"
  Entonces recibo un mensaje indicando los campos obligatorios faltantes
  Y el usuario no se crea

Escenario: Intento de crear usuario sin permisos
  Dado que soy un usuario con rol "Recepcionista"
  Cuando intento acceder al módulo de gestión de usuarios
  Entonces no puedo ver la opción de gestión de usuarios en el menú
  Y no tengo acceso a esta funcionalidad
```

### Historia 1.3: Editar usuario existente
**Como** administrador del hotel  
**Quiero** modificar la información de usuarios existentes  
**Para** mantener los datos actualizados

**Criterios de aceptación:**
- Debo poder editar nombre, cargo, usuario, celular, DNI y rol
- Debo poder cambiar la contraseña (opcional, si no se ingresa se mantiene la actual)
- Los cambios deben guardarse correctamente

#### Escenarios Gherkin:

```gherkin
Escenario: Edición exitosa de usuario
  Dado que soy un administrador y existe un usuario "Carlos Ruiz"
  Cuando edito su información cambiando el cargo a "Supervisor"
  Y hago clic en "Actualizar"
  Entonces los cambios se guardan correctamente
  Y recibo un mensaje de confirmación
  Y la información actualizada se refleja en la lista de usuarios

Escenario: Cambio de rol de usuario
  Dado que soy un administrador y existe un usuario con rol "Recepcionista"
  Cuando cambio su rol a "Administrador"
  Y hago clic en "Actualizar"
  Entonces el usuario adquiere los permisos del nuevo rol
  Y el cambio se refleja en la interfaz
```

### Historia 1.4: Eliminar usuario
**Como** administrador del hotel  
**Quiero** eliminar usuarios que ya no trabajan en el hotel  
**Para** mantener la seguridad del sistema

**Criterios de aceptación:**
- Debo poder eliminar usuarios desde la interfaz
- Debo confirmar la eliminación antes de ejecutarla
- El usuario debe desaparecer de la lista después de la eliminación

#### Escenarios Gherkin:

```gherkin
Escenario: Eliminación exitosa de usuario
  Dado que soy un administrador y existe un usuario activo "Pedro Gómez"
  Cuando hago clic en el botón de eliminar
  Y confirmo la eliminación
  Entonces el usuario es eliminado del sistema
  Y recibo un mensaje de confirmación
  Y el usuario desaparece de la lista
```

---

## Épica 2: Gestión de Inventario de Habitaciones

### Historia 2.1: Registrar habitaciones del hotel
**Como** administrador del hotel  
**Quiero** registrar las habitaciones disponibles en el sistema  
**Para** poder gestionar el inventario y realizar reservas

**Criterios de aceptación:**
- Debo poder ingresar número de habitación, tipo, capacidad, precio por noche e imagen (opcional)
- El sistema debe validar que los campos obligatorios estén completos
- Debo recibir confirmación cuando la habitación se crea exitosamente

#### Escenarios Gherkin:

```gherkin
Escenario: Registro exitoso de nueva habitación
  Dado que soy un administrador y accedo al módulo de gestión de habitaciones
  Cuando registro una habitación con número "301", tipo "Suite", capacidad 4 personas, precio 250 USD por noche y una URL de imagen
  Y hago clic en "Crear Habitación"
  Entonces la habitación queda registrada en el sistema
  Y aparece en el listado de habitaciones disponibles
  Y puedo visualizar todos sus detalles incluyendo la imagen

Escenario: Registro de habitación sin imagen
  Dado que soy un administrador y accedo al módulo de gestión de habitaciones
  Cuando registro una habitación sin especificar URL de imagen
  Y completo los demás campos obligatorios
  Y hago clic en "Crear Habitación"
  Entonces la habitación se crea exitosamente
  Y se muestra un icono por defecto en lugar de la imagen

Escenario: Intento de registro con datos inválidos
  Dado que soy un administrador y accedo al módulo de gestión de habitaciones
  Cuando intento registrar una habitación con capacidad 0 o precio negativo
  Y hago clic en "Crear Habitación"
  Entonces recibo un mensaje indicando los campos con valores inválidos
  Y la habitación no se registra

Escenario: Intento de registro con campos obligatorios vacíos
  Dado que soy un administrador y accedo al módulo de gestión de habitaciones
  Cuando intento registrar una habitación sin especificar el número o tipo
  Y hago clic en "Crear Habitación"
  Entonces recibo un mensaje indicando los campos obligatorios faltantes
  Y la habitación no se registra
```

### Historia 2.2: Editar habitación existente
**Como** administrador del hotel  
**Quiero** modificar la información de habitaciones existentes  
**Para** actualizar precios, capacidades u otros datos

**Criterios de aceptación:**
- Debo poder editar todos los campos de una habitación
- Los cambios deben guardarse correctamente
- Debo recibir confirmación de la actualización

#### Escenarios Gherkin:

```gherkin
Escenario: Edición exitosa de habitación
  Dado que soy un administrador y existe una habitación registrada
  Cuando edito su precio por noche de 100 USD a 120 USD
  Y hago clic en "Actualizar"
  Entonces los cambios se guardan correctamente
  Y recibo un mensaje de confirmación
  Y el nuevo precio se refleja en la lista de habitaciones
```

### Historia 2.3: Eliminar habitación
**Como** administrador del hotel  
**Quiero** eliminar habitaciones que ya no están disponibles  
**Para** mantener el inventario actualizado

**Criterios de aceptación:**
- Debo poder eliminar habitaciones desde la interfaz
- Debo confirmar la eliminación antes de ejecutarla
- La habitación debe desaparecer de la lista

#### Escenarios Gherkin:

```gherkin
Escenario: Eliminación exitosa de habitación
  Dado que soy un administrador y existe una habitación registrada
  Cuando hago clic en el botón de eliminar
  Y confirmo la eliminación en el diálogo
  Entonces la habitación es eliminada del sistema
  Y recibo un mensaje de confirmación
  Y la habitación desaparece de la lista
```

### Historia 2.4: Consultar habitaciones disponibles
**Como** recepcionista  
**Quiero** visualizar las habitaciones disponibles para un rango de fechas  
**Para** poder seleccionar una habitación al crear una reserva

**Criterios de aceptación:**
- Debo poder ver las habitaciones disponibles al seleccionar fechas de entrada y salida
- Debo poder filtrar por tipo de habitación
- Debo ver información relevante: número, tipo, capacidad, precio y disponibilidad

#### Escenarios Gherkin:

```gherkin
Escenario: Visualización de habitaciones disponibles
  Dado que estoy creando una nueva reserva
  Y he seleccionado fechas de entrada y salida
  Cuando el sistema carga las habitaciones disponibles
  Entonces veo una lista de habitaciones con sus detalles
  Y cada habitación muestra número, tipo, capacidad y precio por noche
  Y puedo seleccionar una habitación para la reserva

Escenario: Filtrado por tipo de habitación
  Dado que estoy visualizando habitaciones disponibles
  Cuando filtro por habitaciones tipo "Suite"
  Entonces solo veo las habitaciones de ese tipo
  Y puedo verificar su disponibilidad específica
```

---

## Épica 3: Creación de Reservas por Recepcionista

### Historia 3.1: Crear reserva para un huésped
**Como** recepcionista  
**Quiero** crear una reserva en nombre de un huésped  
**Para** asegurar su alojamiento cuando llama o llega al mostrador

**Criterios de aceptación:**
- Debo poder crear una reserva mediante un formulario multi-paso
- Debo ingresar datos del huésped, fechas, número de huéspedes y seleccionar habitación
- El sistema debe validar disponibilidad y capacidad
- Debo recibir un número de reserva único al completar el proceso

#### Escenarios Gherkin:

```gherkin
Escenario: Creación exitosa de reserva
  Dado que la habitación 301 está disponible del "10/03/2026" al "15/03/2026"
  Cuando creo una reserva para el huésped "Juan Pérez" con sus datos de contacto
  Y selecciono las fechas de entrada y salida
  Y especifico 2 huéspedes
  Y selecciono la habitación 301
  Y confirmo la reserva
  Entonces la reserva se crea en estado "Pendiente"
  Y recibo un número de reserva único
  Y puedo ver el resumen con el monto total calculado
  Y la reserva aparece en la lista de reservas pendientes

Escenario: Creación de reserva con validación de capacidad
  Dado que la habitación 301 tiene capacidad para 2 personas
  Cuando intento crear una reserva para 4 huéspedes
  Y selecciono la habitación 301
  Entonces el sistema me muestra una advertencia sobre la capacidad
  Y puedo seleccionar otra habitación con capacidad adecuada

Escenario: Intento de reserva con fechas inválidas
  Dado que estoy creando una reserva
  Cuando intento seleccionar una fecha de entrada anterior a hoy
  Entonces el sistema no me permite seleccionar fechas pasadas
  Y recibo un mensaje indicando que no se permiten fechas pasadas

Escenario: Intento de reserva con fecha de salida anterior a entrada
  Dado que estoy creando una reserva
  Cuando selecciono una fecha de salida anterior a la fecha de entrada
  Entonces recibo un mensaje indicando que la fecha de salida debe ser posterior a la de entrada
  Y no puedo continuar hasta corregir las fechas
```

### Historia 3.2: Registrar información completa del huésped
**Como** recepcionista  
**Quiero** capturar toda la información necesaria del huésped durante la reserva  
**Para** mantener un registro completo y poder contactarlo

**Criterios de aceptación:**
- Debo poder ingresar nombre, apellido, documento, correo y teléfono
- El sistema debe validar el formato de correo electrónico
- El sistema debe validar el formato de teléfono
- Todos los campos deben ser obligatorios

#### Escenarios Gherkin:

```gherkin
Escenario: Registro completo de datos del huésped
  Dado que estoy creando una reserva
  Cuando ingreso nombre "María", apellido "García", documento "12345678", teléfono "+57 300 1234567" y correo "maria@email.com"
  Y todos los datos son válidos
  Entonces la información se asocia correctamente a la reserva
  Y puedo continuar con el siguiente paso del formulario

Escenario: Intento de registro con correo inválido
  Dado que estoy creando una reserva
  Cuando ingreso un correo electrónico en formato inválido "maria.email.com"
  Y intento avanzar al siguiente paso
  Entonces recibo un mensaje indicando el formato correcto requerido
  Y no puedo avanzar hasta corregir el dato

Escenario: Intento de registro con teléfono inválido
  Dado que estoy creando una reserva
  Cuando ingreso un teléfono con formato inválido
  Y intento avanzar al siguiente paso
  Entonces recibo un mensaje indicando el formato correcto requerido
  Y no puedo avanzar hasta corregir el dato
```

---

## Épica 4: Confirmación y Pago de Reservas

### Historia 4.1: Confirmar pago de reserva
**Como** recepcionista  
**Quiero** registrar que un huésped ha completado el pago  
**Para** confirmar definitivamente su reserva

**Criterios de aceptación:**
- Debo poder confirmar el pago desde la lista de reservas pendientes
- Debo poder seleccionar el método de pago (Efectivo, Tarjeta, Transferencia)
- Debo ingresar el monto y referencia (si aplica)
- La reserva debe cambiar a estado "Confirmada" después del pago

#### Escenarios Gherkin:

```gherkin
Escenario: Confirmación de pago en efectivo
  Dado que existe una reserva en estado "Pendiente" por 1250 USD
  Cuando selecciono la reserva y hago clic en "Confirmar Pago"
  Y selecciono método de pago "Efectivo"
  Y ingreso el monto recibido "1250 USD"
  Y confirmo el pago
  Entonces la reserva cambia a estado "Confirmada"
  Y se registra el método de pago como "Efectivo"
  Y la reserva desaparece de la lista de pendientes
  Y aparece en el dashboard para check-in

Escenario: Confirmación de pago con tarjeta
  Dado que existe una reserva en estado "Pendiente" por 1500 USD
  Cuando selecciono la reserva y hago clic en "Confirmar Pago"
  Y selecciono método de pago "Tarjeta"
  Y ingreso el número de referencia "AUTH-789456"
  Y ingreso el monto "1500 USD"
  Y confirmo el pago
  Entonces la reserva cambia a estado "Confirmada"
  Y se registra el método de pago como "Tarjeta"
  Y se guarda el número de referencia

Escenario: Confirmación de pago por transferencia bancaria
  Dado que existe una reserva en estado "Pendiente" por 2000 USD
  Cuando selecciono la reserva y hago clic en "Confirmar Pago"
  Y selecciono método de pago "Transferencia"
  Y ingreso el número de comprobante "TRF-2026-001234"
  Y ingreso el monto "2000 USD"
  Y confirmo el pago
  Entonces la reserva cambia a estado "Confirmada"
  Y se registra el método de pago como "Transferencia"
  Y se guarda el número de comprobante

Escenario: Intento de confirmar pago sin ingresar referencia requerida
  Dado que existe una reserva en estado "Pendiente"
  Cuando intento registrar un pago con tarjeta
  Y no ingreso el número de referencia del POS
  Y intento confirmar el pago
  Entonces recibo un mensaje indicando que la referencia es obligatoria
  Y el pago no se registra hasta completar el dato

Escenario: Intento de confirmar pago con monto incorrecto
  Dado que existe una reserva en estado "Pendiente" por 1250 USD
  Cuando intento registrar un pago de 1000 USD
  Y confirmo el pago
  Entonces el sistema valida el monto
  Y puedo corregir el monto antes de confirmar
```

### Historia 4.2: Realizar check-in del huésped
**Como** recepcionista  
**Quiero** registrar la llegada del huésped al hotel  
**Para** activar su reserva y asignar la habitación

**Criterios de aceptación:**
- Solo debo poder hacer check-in de reservas confirmadas
- El check-in debe cambiar el estado de la reserva a "Activa"
- Debo poder realizar check-in desde el dashboard

#### Escenarios Gherkin:

```gherkin
Escenario: Check-in exitoso de reserva confirmada
  Dado que existe una reserva en estado "Confirmada" con fecha de entrada hoy
  Y la reserva aparece en la sección de "Llegadas de Hoy" del dashboard
  Cuando hago clic en el botón "Check-in" de la reserva
  Entonces la reserva cambia a estado "Activa"
  Y recibo un mensaje de confirmación
  Y la reserva desaparece de la lista de llegadas
  Y se registra la fecha y hora de check-in

Escenario: Intento de check-in de reserva pendiente
  Dado que existe una reserva en estado "Pendiente"
  Cuando intento realizar el check-in desde el dashboard
  Entonces la reserva no aparece en la lista de llegadas
  Y debo confirmar el pago primero
```

### Historia 4.3: Realizar check-out del huésped
**Como** recepcionista  
**Quiero** registrar la salida del huésped del hotel  
**Para** liberar la habitación y completar la reserva

**Criterios de aceptación:**
- Debo poder hacer check-out de reservas activas
- El check-out debe cambiar el estado de la reserva a "Completada"
- Debo poder realizar check-out desde el dashboard

#### Escenarios Gherkin:

```gherkin
Escenario: Check-out exitoso en fecha programada
  Dado que existe una reserva en estado "Activa"
  Y la fecha de salida programada es hoy
  Y la reserva aparece en la sección de "Salidas de Hoy" del dashboard
  Cuando hago clic en el botón "Check-out" de la reserva
  Entonces la reserva cambia a estado "Completada"
  Y recibo un mensaje de confirmación
  Y la reserva desaparece de la lista de salidas
  Y se registra la fecha y hora de check-out
```

---

## Épica 5: Consulta y Búsqueda de Reservas

### Historia 5.1: Buscar reservas existentes
**Como** recepcionista  
**Quiero** buscar reservas por diferentes criterios  
**Para** localizar rápidamente la información que necesito

**Criterios de aceptación:**
- Debo poder buscar por número de reserva (búsqueda exacta)
- Debo poder buscar por nombre de huésped (búsqueda parcial)
- Los resultados deben mostrarse en tiempo real mientras escribo
- Debo ver todos los detalles de la reserva encontrada

#### Escenarios Gherkin:

```gherkin
Escenario: Búsqueda por número de reserva
  Dado que existen múltiples reservas en el sistema
  Cuando ingreso el número de reserva "RES-2026-001234" en el campo de búsqueda
  Entonces el sistema busca y muestra la reserva correspondiente
  Y veo todos sus detalles: huésped, habitación, fechas y estado
  Y los resultados aparecen mientras escribo

Escenario: Búsqueda por nombre de huésped
  Dado que existen múltiples reservas en el sistema
  Cuando ingreso el nombre "Juan Pérez" en el campo de búsqueda
  Y selecciono la pestaña "Por Nombre de Huésped"
  Entonces veo todas las reservas asociadas a ese nombre
  Y están ordenadas por fecha de llegada
  Y puedo ver el estado de cada una

Escenario: Búsqueda sin resultados
  Dado que busco por un criterio que no existe en el sistema
  Cuando ingreso número de reserva "RES-9999-999999"
  Entonces recibo un mensaje indicando que no se encontraron resultados
  Y se me sugiere verificar los datos de búsqueda

Escenario: Cambio entre tipos de búsqueda
  Dado que estoy en la página de búsqueda
  Cuando cambio de la pestaña "Por Número de Reserva" a "Por Nombre de Huésped"
  Entonces el campo de búsqueda se actualiza con el placeholder correspondiente
  Y puedo realizar búsquedas con el nuevo criterio
```

### Historia 5.2: Ver reservas del día
**Como** recepcionista  
**Quiero** visualizar todas las llegadas y salidas del día actual o de una fecha específica  
**Para** preparar las habitaciones y gestionar los check-in/check-out

**Criterios de aceptación:**
- Debo poder ver las reservas del día actual en el dashboard
- Debo poder seleccionar una fecha específica para ver sus reservas
- Debo ver separadas las llegadas (check-ins) y salidas (check-outs)
- Debo ver estadísticas del día: total de reservas, check-ins, check-outs e ingresos

#### Escenarios Gherkin:

```gherkin
Escenario: Visualización de llegadas del día
  Dado que existen reservas con fecha de entrada para hoy
  Cuando accedo al dashboard
  Entonces veo una lista de todas las reservas con entrada programada en la sección "Llegadas de Hoy"
  Y cada reserva muestra: nombre del huésped, habitación asignada, fechas y estado
  Y puedo realizar el check-in de cada una

Escenario: Visualización de salidas del día
  Dado que existen reservas con fecha de salida para hoy
  Cuando accedo al dashboard
  Entonces veo una lista de todas las reservas con salida programada en la sección "Salidas de Hoy"
  Y cada reserva muestra: nombre del huésped, habitación y hora límite de salida
  Y puedo realizar el check-out de cada una

Escenario: Visualización de estadísticas del día
  Dado que accedo al dashboard
  Cuando veo el resumen del día
  Entonces veo tarjetas con estadísticas: total de reservas, check-ins, check-outs e ingresos del día
  Y los números se actualizan según las reservas del día

Escenario: Consulta de reservas de fecha específica
  Dado que accedo al dashboard
  Cuando selecciono una fecha específica usando el selector de fecha
  Entonces veo las llegadas y salidas programadas para esa fecha
  Y las estadísticas se actualizan para esa fecha
  Y puedo volver a ver el día actual con un botón

Escenario: Día sin llegadas ni salidas programadas
  Dado que no existen reservas con entrada o salida para la fecha seleccionada
  Cuando accedo al dashboard para esa fecha
  Entonces veo mensajes indicando que no hay llegadas ni salidas programadas
  Y las secciones se muestran vacías con mensajes informativos
```

### Historia 5.3: Ver reservas pendientes
**Como** recepcionista  
**Quiero** visualizar todas las reservas pendientes de pago  
**Para** gestionar su confirmación

**Criterios de aceptación:**
- Debo poder ver todas las reservas en estado "Pendiente"
- Debo poder confirmar el pago desde esta vista
- Debo poder cancelar reservas desde esta vista

#### Escenarios Gherkin:

```gherkin
Escenario: Visualización de reservas pendientes
  Dado que existen reservas en estado "Pendiente"
  Cuando accedo a la vista de "Reservas Pendientes"
  Entonces veo una lista de todas las reservas pendientes de pago
  Y cada reserva muestra sus detalles: huésped, habitación, fechas, monto total
  Y puedo confirmar el pago o cancelar cada reserva

Escenario: Vista sin reservas pendientes
  Dado que no existen reservas en estado "Pendiente"
  Cuando accedo a la vista de "Reservas Pendientes"
  Entonces veo un mensaje indicando que no hay reservas pendientes
  Y la vista se muestra vacía con un mensaje informativo
```

---

## Épica 6: Cancelación de Reservas

### Historia 6.1: Cancelar reserva existente
**Como** recepcionista  
**Quiero** cancelar una reserva a solicitud del huésped  
**Para** liberar la habitación y gestionar el reembolso según política

**Criterios de aceptación:**
- Debo poder cancelar reservas desde la vista de reservas pendientes
- Debo ingresar un motivo de cancelación
- El sistema debe calcular automáticamente penalidades y reembolsos
- Debo recibir información sobre el monto de reembolso o penalización

#### Escenarios Gherkin:

```gherkin
Escenario: Cancelación exitosa de reserva pendiente
  Dado que existe una reserva en estado "Pendiente"
  Cuando hago clic en el botón de cancelar
  Y ingreso el motivo de cancelación "Cambio de planes del huésped"
  Y confirmo la cancelación
  Entonces la reserva cambia a estado "Cancelada"
  Y recibo información sobre reembolso o penalización aplicada
  Y la reserva desaparece de la lista de pendientes
  Y la habitación queda disponible nuevamente

Escenario: Cancelación con motivo requerido
  Dado que existe una reserva en estado "Pendiente"
  Cuando intento cancelar la reserva sin ingresar un motivo
  Y confirmo la cancelación
  Entonces recibo un mensaje indicando que el motivo es obligatorio
  Y la cancelación no se completa hasta ingresar el motivo
```

---

## Notas Técnicas

- El frontend utiliza React con TypeScript
- La autenticación se gestiona mediante tokens JWT almacenados en localStorage
- Las peticiones se realizan mediante React Query para gestión de estado del servidor
- El sistema valida permisos basados en roles (ADMINISTRADOR, RECEPCIONISTA)
- Las validaciones de formularios se realizan tanto en frontend como en backend

