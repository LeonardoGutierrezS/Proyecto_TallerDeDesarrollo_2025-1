# Middlewares Documentation - SIREC V3

## 📋 Índice de Middlewares

### 🔐 Autenticación y Autorización

#### `authentication.middleware.js`
- **`authenticateJwt`**: Verifica que el usuario tenga un token JWT válido

#### `authorization.middleware.js`
- **`isAdmin`**: Verifica que el usuario tenga rol de administrador y esté vigente
- **`isVigente`**: Verifica que el usuario esté vigente (no en lista negra)

---

### 🖥️ Validación de Equipos

#### `equipo.middleware.js`
- **`equipoExists`**: Verifica que un equipo existe en la base de datos
- **`equipoDisponible`**: Verifica que un equipo existe y está disponible para préstamo

**Uso:**
```javascript
import { equipoExists, equipoDisponible } from "./middlewares/equipo.middleware.js";

router.post("/prestamo", authenticateJwt, equipoDisponible, createPrestamo);
```

---

### 👤 Validación de Usuarios

#### `usuario.middleware.js`
- **`noEnListaNegra`**: Verifica que un usuario no está en lista negra activa
- **`usuarioVigente`**: Verifica que un usuario existe y está vigente

**Uso:**
```javascript
import { noEnListaNegra, usuarioVigente } from "./middlewares/usuario.middleware.js";

router.post("/prestamo", authenticateJwt, usuarioVigente, noEnListaNegra, createPrestamo);
```

---

### 📋 Validación de Préstamos

#### `prestamo.middleware.js`
- **`prestamoExists`**: Verifica que un préstamo existe
- **`prestamoActivo`**: Verifica que un préstamo existe y está activo (no devuelto)
- **`limitePrestamosPorUsuario`**: Verifica que el usuario no exceda el límite de préstamos activos (default: 3)

**Uso:**
```javascript
import { prestamoActivo, limitePrestamosPorUsuario } from "./middlewares/prestamo.middleware.js";

router.post("/prestamo", authenticateJwt, limitePrestamosPorUsuario, createPrestamo);
router.patch("/prestamo/:id/finalizar", authenticateJwt, prestamoActivo, finalizarPrestamo);
```

---

### ✅ Validación de Datos

#### `validation.middleware.js`

**Funciones disponibles:**

1. **`validateRequiredFields(requiredFields)`**
   - Valida que los campos especificados estén presentes en el body
   ```javascript
   router.post("/equipo", 
     validateRequiredFields(["ID_Num_Inv", "Modelo", "Numero_Serie"]),
     createEquipo
   );
   ```

2. **`validateNumericId`**
   - Valida que el ID en params sea un número válido

3. **`validateRut`**
   - Valida formato de RUT chileno (12345678-9)

4. **`validateEmail`**
   - Valida formato de email

5. **`validateDate(dateField)`**
   - Valida que una fecha tenga formato válido
   ```javascript
   router.post("/lista-negra", 
     validateDate("fecha_termino"),
     createListaNegra
   );
   ```

6. **`validateDateRange`**
   - Valida que fecha_termino sea posterior a fecha_inicio

7. **`sanitizeInput`**
   - Limpia y sanitiza strings en body y query params
   - Remueve caracteres potencialmente peligrosos

---

### 📝 Logging

#### `logger.middleware.js`

**Funciones disponibles:**

1. **`requestLogger`**
   - Registra todas las peticiones HTTP
   - Muestra: timestamp, método, URL, IP, duración
   - Oculta passwords en los logs

2. **`errorLogger`**
   - Registra errores del servidor
   - Muestra: timestamp, mensaje, stack trace, URL, método, IP

**Uso en index.js:**
```javascript
import { requestLogger, errorLogger } from "./middlewares/logger.middleware.js";

app.use(requestLogger); // Antes de las rutas
app.use(errorLogger);   // Después de las rutas (error handler)
```

---

### 🔒 Seguridad

#### `security.middleware.js`

**Funciones disponibles:**

1. **`bodyLimit(limit)`**
   - Limita el tamaño del body de las peticiones
   - Default: '10mb'
   ```javascript
   app.use(bodyLimit('5mb'));
   ```

2. **`rateLimit(options)`**
   - Rate limiting simple (en memoria)
   - Options:
     - `windowMs`: Ventana de tiempo (default: 15 min)
     - `max`: Máximo de requests (default: 100)
     - `message`: Mensaje de error personalizado
   ```javascript
   app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
   ```

3. **`customCors(options)`**
   - CORS personalizado
   - Options: origin, methods, credentials, allowedHeaders

4. **`securityHeaders`**
   - Agrega headers de seguridad:
     - X-Frame-Options: DENY
     - X-Content-Type-Options: nosniff
     - X-XSS-Protection: 1; mode=block
     - Strict-Transport-Security
     - Content-Security-Policy

**Uso en index.js:**
```javascript
import { securityHeaders, rateLimit } from "./middlewares/security.middleware.js";

app.use(securityHeaders);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
```

---

## 🎯 Ejemplos de Uso Combinado

### Crear Préstamo (con todas las validaciones)
```javascript
router.post("/prestamo",
  authenticateJwt,              // Usuario autenticado
  isAdmin,                       // Debe ser admin
  sanitizeInput,                 // Limpiar entrada
  validateRequiredFields([       // Campos requeridos
    "ID_Usuario",
    "ID_Num_Inv",
    "Hora_inicio_prestamo"
  ]),
  usuarioVigente,                // Usuario válido y vigente
  noEnListaNegra,                // No en lista negra
  limitePrestamosPorUsuario,     // No exceder límite
  equipoDisponible,              // Equipo disponible
  createPrestamo
);
```

### Finalizar Préstamo
```javascript
router.patch("/prestamo/:id/finalizar",
  authenticateJwt,
  isAdmin,
  validateNumericId,
  prestamoActivo,
  finalizarPrestamo
);
```

### Crear Usuario (con validaciones)
```javascript
router.post("/user",
  sanitizeInput,
  validateRut,
  validateEmail,
  validateRequiredFields(["Nombre_Completo", "Correo", "Rut"]),
  createUser
);
```

### Agregar a Lista Negra
```javascript
router.post("/lista-negra",
  authenticateJwt,
  isAdmin,
  validateRequiredFields(["ID_Usuario", "ID_Prestamo", "ID_Motivo", "fecha_termino"]),
  validateDate("fecha_inicio"),
  validateDate("fecha_termino"),
  validateDateRange,
  createListaNegra
);
```

---

## 🔧 Configuración Recomendada en index.js

```javascript
import express from "express";
import {
  requestLogger,
  errorLogger,
  securityHeaders,
  rateLimit,
  sanitizeInput,
} from "./middlewares/index.js";

const app = express();

// Middlewares globales de seguridad
app.use(securityHeaders);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Logging
app.use(requestLogger);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitización global
app.use(sanitizeInput);

// Rutas
app.use("/api", routes);

// Error logging (debe ir después de las rutas)
app.use(errorLogger);

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: "Server error",
    message: err.message || "Error interno del servidor",
  });
});
```

---

## 📊 Resumen de Middlewares

| Categoría | Cantidad | Archivos |
|-----------|----------|----------|
| Autenticación/Autorización | 3 | 2 archivos |
| Validación de Entidades | 8 | 3 archivos |
| Validación de Datos | 8 | 1 archivo |
| Logging | 2 | 1 archivo |
| Seguridad | 4 | 1 archivo |
| **TOTAL** | **25 middlewares** | **8 archivos** |

---

## ⚠️ Notas Importantes

1. **Orden de los middlewares**: El orden importa. Los middlewares de validación deben ir antes de los controllers.

2. **Rate Limiting**: El rate limiting implementado es simple y usa memoria. Para producción, considera usar Redis.

3. **Sanitización**: `sanitizeInput` debe usarse con cuidado ya que modifica el request.

4. **Logging de passwords**: `requestLogger` automáticamente oculta campos de contraseña.

5. **Performance**: No agregues demasiados middlewares a una ruta, puede afectar el rendimiento.

6. **Errores**: Todos los middlewares usan `handleErrorClient` y `handleErrorServer` para respuestas consistentes.
