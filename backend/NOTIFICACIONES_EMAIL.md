# 📧 Sistema de Notificaciones por Email - SIREC

## 📋 Descripción

El sistema de notificaciones por email envía automáticamente correos electrónicos a los usuarios cuando:

1. **Se crea una nueva solicitud de préstamo** - Confirmación inmediata al usuario
2. **Cambia el estado de una solicitud** - Notificación de aprobación, rechazo, entrega, etc.

## ⚙️ Configuración

### 1. Variables de Entorno

Agregar al archivo `.env` del backend:

```env
# Configuración de email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion

# URL del frontend para enlaces en emails
FRONTEND_URL=http://localhost:3000
```

### 2. Configuración de Gmail

Para usar Gmail como servidor de correo:

1. **Activar verificación en 2 pasos** en tu cuenta de Gmail
2. **Generar contraseña de aplicación**:
   - Ve a [Configuración de cuenta de Google](https://myaccount.google.com)
   - Seguridad → Verificación en 2 pasos → Contraseñas de aplicaciones
   - Genera una nueva contraseña para "Aplicación de correo"
   - Usa esta contraseña en `EMAIL_PASS`

### 3. Servicios de Email Alternativos

Para otros proveedores de email, modifica las variables:

**Outlook/Hotmail:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
```

**Yahoo:**
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
```

## 🚀 Implementación

### Archivos Creados/Modificados

1. **`src/services/email.service.js`** - Servicio base de email (configurado)
2. **`src/services/prestamo-notifications.service.js`** - Notificaciones específicas de préstamos
3. **`src/services/prestamo.service.js`** - Integración con notificaciones
4. **`src/config/configEnv.js`** - Variables de configuración

### Funciones Principales

#### `sendSolicitudCreatedNotification(userEmail, userName, solicitudData)`

Envía notificación cuando se crea una nueva solicitud.

**Parámetros:**
- `userEmail`: Email del usuario
- `userName`: Nombre completo del usuario  
- `solicitudData`: Objeto con datos de la solicitud

**Contenido del email:**
- Número de solicitud
- Detalles del equipo (marca, modelo, serie)
- Fechas y horarios
- Estado actual
- Enlace a "Mis Solicitudes"

#### `sendSolicitudStatusUpdateNotification(userEmail, userName, solicitudData, estadoAnterior)`

Envía notificación cuando cambia el estado de una solicitud.

**Parámetros:**
- `userEmail`: Email del usuario
- `userName`: Nombre completo del usuario
- `solicitudData`: Objeto con datos actualizados
- `estadoAnterior`: Estado previo de la solicitud

**Estados soportados:**
- ✅ **Aprobado** - Color verde, mensaje positivo
- ❌ **Rechazado** - Color rojo, incluye motivo
- 📦 **Entregado** - Color azul, confirmación de entrega
- 🔄 **Devuelto** - Color púrpura, préstamo completado

## 📧 Estructura del Email

### Email de Solicitud Creada

```html
✅ Solicitud Registrada Exitosamente
Tu solicitud ha sido recibida y está siendo procesada

📋 Detalles de tu Solicitud
- Número de Solicitud: #123
- Equipo: HP EliteBook 840 G8
- Categoría: Notebooks
- Fecha Inicio: 5 de agosto de 2025
- Fecha Fin: 7 de agosto de 2025
- Horario: 09:00 - 17:00
- Estado: Pendiente

📌 Próximos Pasos
- Tu solicitud está siendo revisada
- Recibirás notificaciones de cambios
- Consulta estado en "Mis Solicitudes"

[Ver Mis Solicitudes]
```

### Email de Cambio de Estado

```html
✅ Actualización de Solicitud
Solicitud #123

Estado: Aprobado
¡Excelente! Tu solicitud ha sido aprobada.

📋 Resumen
- Equipo: HP EliteBook 840 G8
- Período: 5/8/2025 - 7/8/2025
- Horario: 09:00 - 17:00

[Ver Detalles Completos]
```

## 🧪 Pruebas

### Script de Prueba

Ejecutar desde el directorio backend:

```bash
node test-notifications.js
```

**Nota:** Modificar el email en el archivo antes de ejecutar.

### Prueba Manual

1. Crear una nueva solicitud desde el frontend
2. Verificar recepción del email de confirmación
3. Cambiar estado de la solicitud (aprobar/rechazar)
4. Verificar recepción del email de actualización

## 🛠️ Solución de Problemas

### Error: "Error enviando el correo"

**Posibles causas:**
1. Credenciales incorrectas en `.env`
2. Contraseña de aplicación no configurada
3. Verificación en 2 pasos no activada
4. Variables de entorno no cargadas

**Solución:**
```bash
# Verificar variables de entorno
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);
```

### Email no recibido

**Verificar:**
1. Carpeta de spam/correo no deseado
2. Email válido en base de datos
3. Logs del servidor backend
4. Configuración SMTP

### Error de conexión SMTP

**Para Gmail:**
- Verificar que la verificación en 2 pasos esté activada
- Usar contraseña de aplicación, no la contraseña normal
- Puerto 587 con TLS

## 📊 Logs y Monitoreo

El sistema registra automáticamente:

```javascript
// Éxito
console.log(`✅ Notificación enviada a ${email}`);

// Error
console.error("⚠️ Error enviando notificación:", error.message);
```

**Nota:** Los errores de email NO bloquean la creación/actualización de solicitudes.

## 🔄 Flujo Completo

1. **Usuario crea solicitud** → Sistema envía email de confirmación
2. **Admin revisa solicitud** → No hay email automático
3. **Admin aprueba/rechaza** → Sistema envía email de actualización
4. **Admin marca como entregado** → Sistema envía email de entrega
5. **Admin marca como devuelto** → Sistema envía email de finalización

## 🎨 Personalización

### Modificar Templates

Editar archivos en `src/services/prestamo-notifications.service.js`:

```javascript
// Cambiar colores
const estadoColor = "#tu_color";

// Modificar mensajes
const mensajePersonalizado = "Tu mensaje personalizado";

// Agregar más información
const html = `tu_template_personalizado`;
```

### Agregar Nuevos Tipos de Notificación

1. Crear nueva función en `prestamo-notifications.service.js`
2. Importar en `prestamo.service.js`
3. Llamar en el momento apropiado

## 📋 Checklist de Implementación

- [x] ✅ Configurar variables de entorno
- [x] ✅ Instalar dependencia nodemailer
- [x] ✅ Crear servicio base de email
- [x] ✅ Crear servicio de notificaciones de préstamos
- [x] ✅ Integrar en creación de solicitudes
- [x] ✅ Integrar en actualización de estado
- [x] ✅ Manejar errores sin bloquear operaciones
- [x] ✅ Agregar logs informativos
- [ ] 🔄 Probar con email real
- [ ] 🔄 Verificar en diferentes clientes de email
- [ ] 🔄 Documentar para el equipo

¡El sistema de notificaciones está listo para usar! 🎉
