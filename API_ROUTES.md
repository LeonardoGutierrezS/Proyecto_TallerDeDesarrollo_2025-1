# API Routes Documentation - SIREC V3

Base URL: `http://localhost:3000/api`

## 🔐 Autenticación

### Auth Routes (`/api/auth`)
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/logout` - Cerrar sesión

---

## 👥 Usuarios

### User Routes (`/api/user`) 🔒 Requiere autenticación + Admin
- `GET /api/user` - Listar todos los usuarios
- `GET /api/user/detail?id=:id` - Obtener usuario por ID
- `GET /api/user/detail?rut=:rut` - Obtener usuario por RUT
- `GET /api/user/detail?email=:email` - Obtener usuario por email
- `PATCH /api/user/detail` - Actualizar usuario
- `DELETE /api/user/detail` - Eliminar usuario

---

## 📚 Catálogos

### Rol Routes (`/api/rol`) 🔒 Requiere autenticación
- `GET /api/rol` - Listar todos los roles
- `GET /api/rol/:id` - Obtener rol por ID
- `POST /api/rol` - Crear nuevo rol 🔒 Admin
- `PUT /api/rol/:id` - Actualizar rol 🔒 Admin
- `DELETE /api/rol/:id` - Eliminar rol 🔒 Admin

### Carrera Routes (`/api/carrera`) 🔒 Requiere autenticación
- `GET /api/carrera` - Listar todas las carreras
- `GET /api/carrera/:id` - Obtener carrera por ID
- `POST /api/carrera` - Crear nueva carrera 🔒 Admin
- `PUT /api/carrera/:id` - Actualizar carrera 🔒 Admin
- `DELETE /api/carrera/:id` - Eliminar carrera 🔒 Admin

### Motivo Routes (`/api/motivo`) 🔒 Requiere autenticación
- `GET /api/motivo` - Listar todos los motivos
- `GET /api/motivo/:id` - Obtener motivo por ID
- `POST /api/motivo` - Crear nuevo motivo 🔒 Admin
- `PUT /api/motivo/:id` - Actualizar motivo 🔒 Admin
- `DELETE /api/motivo/:id` - Eliminar motivo 🔒 Admin

### Tipo Documento Routes (`/api/tipo-documento`) 🔒 Requiere autenticación
- `GET /api/tipo-documento` - Listar todos los tipos de documento
- `GET /api/tipo-documento/:id` - Obtener tipo de documento por ID
- `POST /api/tipo-documento` - Crear nuevo tipo de documento 🔒 Admin
- `PUT /api/tipo-documento/:id` - Actualizar tipo de documento 🔒 Admin
- `DELETE /api/tipo-documento/:id` - Eliminar tipo de documento 🔒 Admin

### Marca Routes (`/api/marca`) 🔒 Requiere autenticación
- `GET /api/marca` - Listar todas las marcas
- `GET /api/marca/:id` - Obtener marca por ID
- `POST /api/marca` - Crear nueva marca 🔒 Admin
- `PUT /api/marca/:id` - Actualizar marca 🔒 Admin
- `DELETE /api/marca/:id` - Eliminar marca 🔒 Admin

### Estado Routes (`/api/estado`) 🔒 Requiere autenticación
- `GET /api/estado` - Listar todos los estados
- `GET /api/estado/:id` - Obtener estado por ID
- `POST /api/estado` - Crear nuevo estado 🔒 Admin
- `PUT /api/estado/:id` - Actualizar estado 🔒 Admin
- `DELETE /api/estado/:id` - Eliminar estado 🔒 Admin

### Categoría Routes (`/api/categoria`) 🔒 Requiere autenticación
- `GET /api/categoria` - Listar todas las categorías
- `GET /api/categoria/:id` - Obtener categoría por ID
- `POST /api/categoria` - Crear nueva categoría 🔒 Admin
- `PUT /api/categoria/:id` - Actualizar categoría 🔒 Admin
- `DELETE /api/categoria/:id` - Eliminar categoría 🔒 Admin

### Estado Préstamo Routes (`/api/estado-prestamo`) 🔒 Requiere autenticación
- `GET /api/estado-prestamo` - Listar todos los estados de préstamo
- `GET /api/estado-prestamo/:id` - Obtener estado de préstamo por ID
- `POST /api/estado-prestamo` - Crear nuevo estado de préstamo 🔒 Admin
- `PUT /api/estado-prestamo/:id` - Actualizar estado de préstamo 🔒 Admin
- `DELETE /api/estado-prestamo/:id` - Eliminar estado de préstamo 🔒 Admin

---

## 🖥️ Equipos

### Equipos Routes (`/api/equipos`) 🔒 Requiere autenticación
- `GET /api/equipos` - Listar todos los equipos
- `GET /api/equipos/disponibles` - Listar equipos disponibles
- `GET /api/equipos/categoria/:categoriaId` - Listar equipos por categoría
- `GET /api/equipos/:id` - Obtener equipo por ID (número de inventario)
- `POST /api/equipos` - Crear nuevo equipo 🔒 Admin
- `PUT /api/equipos/:id` - Actualizar equipo 🔒 Admin
- `PATCH /api/equipos/:id/disponibilidad` - Cambiar disponibilidad 🔒 Admin
- `DELETE /api/equipos/:id` - Eliminar equipo 🔒 Admin

---

## 💻 Detalles Notebook

### Detalles Notebook Routes (`/api/detalles-notebook`) 🔒 Requiere autenticación
- `GET /api/detalles-notebook` - Listar todos los detalles
- `GET /api/detalles-notebook/:id` - Obtener detalles por ID
- `GET /api/detalles-notebook/equipo/:equipoId` - Obtener detalles por equipo
- `POST /api/detalles-notebook` - Crear detalles de notebook 🔒 Admin
- `PUT /api/detalles-notebook/:id` - Actualizar detalles 🔒 Admin
- `DELETE /api/detalles-notebook/:id` - Eliminar detalles 🔒 Admin

---

## 📋 Préstamos

### Préstamo Routes (`/api/prestamo`) 🔒 Requiere autenticación
- `GET /api/prestamo/activos` - Listar préstamos activos
- `GET /api/prestamo/usuario/:usuarioId` - Listar préstamos de un usuario
- `GET /api/prestamo/:id` - Obtener préstamo por ID
- `GET /api/prestamo` - Listar todos los préstamos 🔒 Admin
- `POST /api/prestamo` - Crear nuevo préstamo 🔒 Admin
- `PUT /api/prestamo/:id` - Actualizar préstamo 🔒 Admin
- `PATCH /api/prestamo/:id/finalizar` - Finalizar préstamo (devolver equipo) 🔒 Admin
- `DELETE /api/prestamo/:id` - Eliminar préstamo 🔒 Admin

---

## 🚫 Lista Negra

### Lista Negra Routes (`/api/lista-negra`) 🔒 Requiere autenticación + Admin
- `GET /api/lista-negra` - Listar todos los registros
- `GET /api/lista-negra/activas` - Listar listas negras activas
- `GET /api/lista-negra/usuario/:usuarioId` - Historial de lista negra de un usuario
- `GET /api/lista-negra/verificar/:usuarioId` - Verificar si un usuario está en lista negra
- `GET /api/lista-negra/:id` - Obtener registro por ID
- `POST /api/lista-negra` - Agregar usuario a lista negra
- `PUT /api/lista-negra/:id` - Actualizar registro
- `PATCH /api/lista-negra/:id/levantar` - Levantar sanción de lista negra
- `DELETE /api/lista-negra/:id` - Eliminar registro

---

## 🔑 Leyenda

- 🔒 **Requiere autenticación**: Debe enviar token JWT en headers
- 🔒 **Admin**: Solo usuarios con rol de administrador
- 🔓 **Público**: No requiere autenticación

## 📝 Headers requeridos

Para rutas autenticadas:
```json
{
  "Authorization": "Bearer <token_jwt>"
}
```

## 📊 Formato de respuesta estándar

### Éxito
```json
{
  "status": "Success",
  "message": "Mensaje descriptivo",
  "data": { ... }
}
```

### Error del cliente
```json
{
  "status": "Client error",
  "message": "Mensaje de error",
  "details": { ... }
}
```

### Error del servidor
```json
{
  "status": "Server error",
  "message": "Mensaje de error"
}
```

## 📌 Códigos de estado HTTP

- `200` - OK (Operación exitosa)
- `201` - Created (Recurso creado exitosamente)
- `204` - No Content (Lista vacía)
- `400` - Bad Request (Error de validación)
- `401` - Unauthorized (No autenticado)
- `403` - Forbidden (Sin permisos)
- `404` - Not Found (Recurso no encontrado)
- `500` - Internal Server Error (Error del servidor)
