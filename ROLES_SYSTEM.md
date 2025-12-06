# Sistema de Roles - SIREC_V3

## Roles Disponibles

El sistema SIREC_V3 cuenta con **4 roles** principales:

### 1. 👨‍💼 **Administrador**
- **Descripción**: Encargado de la gestión completa del sistema
- **Permisos**: Acceso total a todas las funcionalidades
- **Responsabilidades**:
  - Gestión de usuarios (crear, editar, eliminar)
  - Gestión de equipos y catálogos
  - Gestión de préstamos
  - Gestión de lista negra
  - Configuración del sistema
  - Visualización de reportes y estadísticas

### 2. 🎓 **Alumno**
- **Descripción**: Estudiante que solicita préstamos de equipos
- **Permisos**: Vista limitada, acceso a sus propios préstamos
- **Responsabilidades**:
  - Solicitar préstamos de equipos
  - Visualizar sus préstamos activos e históricos
  - Actualizar su perfil personal
- **Vista compartida con**: Profesor

### 3. 👨‍🏫 **Profesor**
- **Descripción**: Docente que solicita préstamos de equipos
- **Permisos**: Vista limitada, acceso a sus propios préstamos
- **Responsabilidades**:
  - Solicitar préstamos de equipos
  - Visualizar sus préstamos activos e históricos
  - Actualizar su perfil personal
- **Vista compartida con**: Alumno

### 4. 👔 **Director de Escuela**
- **Descripción**: Director(a) con acceso a reportes y gestión de préstamos
- **Permisos**: Acceso a reportes, estadísticas y gestión de préstamos
- **Responsabilidades**:
  - Visualizar reportes y estadísticas de préstamos
  - Aprobar/Rechazar préstamos
  - Gestionar lista negra
  - Visualizar inventario de equipos
  - Visualizar historial de préstamos

---

## Middlewares de Autorización

### Middlewares Individuales

#### `isAdmin`
Verifica que el usuario tenga rol de **Administrador**.
```javascript
router.get("/admin-only", authenticateJwt, isAdmin, controller);
```

#### `isDirector`
Verifica que el usuario tenga rol de **Director de Escuela**.
```javascript
router.get("/director-only", authenticateJwt, isDirector, controller);
```

#### `isAlumno`
Verifica que el usuario tenga rol de **Alumno**.
```javascript
router.get("/alumno-only", authenticateJwt, isAlumno, controller);
```

#### `isProfesor`
Verifica que el usuario tenga rol de **Profesor**.
```javascript
router.get("/profesor-only", authenticateJwt, isProfesor, controller);
```

### Middlewares Combinados

#### `isAlumnoOrProfesor`
Permite acceso a usuarios con rol **Alumno** o **Profesor** (vista compartida).
```javascript
router.get("/user-view", authenticateJwt, isAlumnoOrProfesor, controller);
```

#### `isAdminOrDirector`
Permite acceso a usuarios con rol **Administrador** o **Director de Escuela**.
```javascript
router.get("/management", authenticateJwt, isAdminOrDirector, controller);
```

#### `isVigente`
Verifica que el usuario esté vigente (no en lista negra).
```javascript
router.post("/action", authenticateJwt, isVigente, controller);
```

---

## Matriz de Permisos

| Funcionalidad | Administrador | Director | Alumno/Profesor |
|--------------|---------------|----------|-----------------|
| **Gestión de Usuarios** |
| Crear usuarios | ✅ | ❌ | ❌ |
| Editar usuarios | ✅ | ❌ | ⚠️ (solo propio perfil) |
| Eliminar usuarios | ✅ | ❌ | ❌ |
| Ver todos los usuarios | ✅ | ✅ | ❌ |
| **Gestión de Equipos** |
| Crear equipos | ✅ | ❌ | ❌ |
| Editar equipos | ✅ | ❌ | ❌ |
| Eliminar equipos | ✅ | ❌ | ❌ |
| Ver equipos | ✅ | ✅ | ✅ |
| **Gestión de Préstamos** |
| Crear préstamo | ✅ | ✅ | ✅ |
| Aprobar préstamo | ✅ | ✅ | ❌ |
| Rechazar préstamo | ✅ | ✅ | ❌ |
| Finalizar préstamo | ✅ | ✅ | ❌ |
| Ver todos los préstamos | ✅ | ✅ | ❌ |
| Ver préstamos propios | ✅ | ✅ | ✅ |
| **Gestión de Lista Negra** |
| Agregar a lista negra | ✅ | ✅ | ❌ |
| Levantar lista negra | ✅ | ✅ | ❌ |
| Ver lista negra | ✅ | ✅ | ❌ |
| **Catálogos** |
| Gestionar catálogos | ✅ | ❌ | ❌ |
| Ver catálogos | ✅ | ✅ | ✅ |
| **Reportes** |
| Ver reportes | ✅ | ✅ | ❌ |
| Exportar datos | ✅ | ✅ | ❌ |

**Leyenda:**
- ✅ Permitido
- ❌ No permitido
- ⚠️ Permitido con restricciones

---

## Usuarios de Prueba

### Administrador
- **Email**: `administrador2024@gmail.cl`
- **Contraseña**: `admin1234`
- **RUT**: 21.308.770-3

### Director de Escuela
- **Email**: `director2024@gmail.cl`
- **Contraseña**: `director1234`
- **RUT**: 15.234.567-8

### Profesores
1. **Email**: `profesor1.2024@gmail.cl`
   - **Contraseña**: `profesor1234`
   - **RUT**: 16.789.012-3

2. **Email**: `profesor2.2024@gmail.cl`
   - **Contraseña**: `profesor1234`
   - **RUT**: 17.345.678-9

### Alumnos
1. **Email**: `alumno1.2024@gmail.cl`
   - **Contraseña**: `alumno1234`
   - **RUT**: 21.151.897-9

2. **Email**: `alumno2.2024@gmail.cl`
   - **Contraseña**: `alumno1234`
   - **RUT**: 20.630.735-8

3. **Email**: `alumno3.2024@gmail.cl`
   - **Contraseña**: `alumno1234`
   - **RUT**: 20.738.450-K

4. **Email**: `alumno4.2024@gmail.cl`
   - **Contraseña**: `alumno1234`
   - **RUT**: 20.976.635-3

5. **Email**: `alumno5.2024@gmail.cl`
   - **Contraseña**: `alumno1234`
   - **RUT**: 21.172.447-1

6. **Email**: `alumno6.2024@gmail.cl`
   - **Contraseña**: `alumno1234`
   - **RUT**: 20.738.415-1

---

## Implementación en Rutas

### Ejemplo: Rutas de Equipos

```javascript
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin, isAdminOrDirector, isAlumnoOrProfesor } from "../middlewares/authorization.middleware.js";
import {
  createEquipo,
  getEquipo,
  getEquipos,
  updateEquipo,
  deleteEquipo,
} from "../controllers/equipos.controller.js";

const router = Router();

// Solo administrador puede crear, editar y eliminar equipos
router.post("/", authenticateJwt, isAdmin, createEquipo);
router.put("/:id", authenticateJwt, isAdmin, updateEquipo);
router.delete("/:id", authenticateJwt, isAdmin, deleteEquipo);

// Admin y Director pueden ver todos los equipos con detalles completos
router.get("/", authenticateJwt, isAdminOrDirector, getEquipos);

// Alumnos y Profesores pueden ver equipos disponibles
router.get("/disponibles", authenticateJwt, isAlumnoOrProfesor, getEquiposDisponibles);

// Obtener un equipo específico (todos los roles autenticados)
router.get("/:id", authenticateJwt, getEquipo);

export default router;
```

### Ejemplo: Rutas de Préstamos

```javascript
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdminOrDirector, isAlumnoOrProfesor, isVigente } from "../middlewares/authorization.middleware.js";
import {
  createPrestamo,
  getPrestamos,
  getPrestamosPorUsuario,
  finalizarPrestamo,
} from "../controllers/prestamo.controller.js";

const router = Router();

// Crear préstamo - requiere estar vigente
router.post("/", authenticateJwt, isVigente, createPrestamo);

// Ver todos los préstamos - solo admin y director
router.get("/", authenticateJwt, isAdminOrDirector, getPrestamos);

// Ver préstamos propios - alumnos y profesores
router.get("/mis-prestamos", authenticateJwt, isAlumnoOrProfesor, getPrestamosPorUsuario);

// Finalizar préstamo - solo admin y director
router.put("/:id/finalizar", authenticateJwt, isAdminOrDirector, finalizarPrestamo);

export default router;
```

---

## Notas Importantes

1. **Todos los middlewares de autorización verifican automáticamente**:
   - Existencia del usuario en la base de datos
   - Estado vigente del usuario
   - Rol del usuario

2. **Orden de middlewares**: Siempre usar `authenticateJwt` antes de cualquier middleware de autorización:
   ```javascript
   router.post("/", authenticateJwt, isAdmin, controller);
   ```

3. **Vista compartida Alumno/Profesor**: Estos dos roles tienen acceso a las mismas funcionalidades mediante el middleware `isAlumnoOrProfesor`.

4. **Flexibilidad de permisos**: El middleware `isAdminOrDirector` permite que tanto el administrador como el director accedan a funcionalidades de gestión.

5. **Estado Vigente**: El middleware `isVigente` es independiente del rol y verifica que el usuario no esté en lista negra.

---

## Cambios Realizados

### ✅ Archivo `initialSetup.js`
- ✅ Agregado rol "Alumno"
- ✅ Agregado rol "Profesor"
- ✅ Agregado rol "Director de Escuela"
- ✅ Eliminado rol "Usuario" (reemplazado por Alumno/Profesor)
- ✅ Creados usuarios de prueba para cada rol

### ✅ Archivo `authorization.middleware.js`
- ✅ Actualizado `isAdmin` con validación correcta
- ✅ Agregado `isDirector`
- ✅ Agregado `isAlumno`
- ✅ Agregado `isProfesor`
- ✅ Agregado `isAlumnoOrProfesor` (vista compartida)
- ✅ Agregado `isAdminOrDirector` (gestión compartida)

### 📝 Siguiente Paso
Actualizar las rutas según los permisos definidos en la matriz.
