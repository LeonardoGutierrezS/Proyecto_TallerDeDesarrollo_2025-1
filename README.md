# 🎓 Sistema de Gestión de Préstamos de Equipos - FACE UBB

**Sistema web para la gestión integral de solicitudes de préstamo de equipos tecnológicos en la Facultad de Ciencias Empresariales (FACE) - Universidad del Bío-Bío.**

Este sistema permite a estudiantes y administradores gestionar de forma eficiente y controlada el **préstamo de equipos** desde una plataforma web centralizada con seguimiento en tiempo real y notificaciones automáticas.

---

## 🎯 Objetivo del proyecto

> **Desarrollar una solución integral, eficiente y escalable** que permita optimizar la gestión de recursos tecnológicos en la FACE, garantizando **transparencia**, **trazabilidad completa** y **facilidad de uso** para toda la comunidad académica, reduciendo significativamente los tiempos de gestión y eliminando los procesos manuales tradicionales.

---

## ✨ Funcionalidades principales

### 👨‍🎓 **Para Estudiantes:**
- 📝 **Solicitud de equipos** mediante interfaz intuitiva
- 🗓️ **Selección de fechas y horarios** específicos con validación automática
- 📊 **Seguimiento en tiempo real** del estado de solicitudes
- 👀 **Vista de equipos disponibles** filtrada por categoría y marca
- 📱 **Panel personal** con historial completo de préstamos
- 📧 **Notificaciones por email** en cada cambio de estado

### 👨‍💼 **Para Administradores:**
- 🛠️ **Gestión completa de equipos** (notebooks, proyectores, tablets, etc.)
- ⚡ **Administración de solicitudes** (aprobar, rechazar, entregar, devolver)
- 📊 **Panel de control** con estadísticas y métricas en tiempo real
- 👥 **Gestión de usuarios** y asignación de roles
- 🕒 **Configuración de horarios disponibles** por equipo y fecha
- 📧 **Sistema de notificaciones automáticas** por email
- 🏷️ **Gestión de categorías y marcas** de equipos
- 📈 **Reportes de uso** y disponibilidad de equipos

### 🔄 **Sistema de Estados:**
- `Pendiente` → `Aprobado` → `Entregado` → `Devuelto`
- `Rechazado` (con motivo especificado)
- Notificaciones automáticas en cada transición de estado
- Trazabilidad completa del ciclo de vida del préstamo

---

## ⚙️ Stack tecnológico completo

### 🖥️ **Backend (Node.js/Express)**
```
• Node.js con Express.js 4.21.0
• TypeORM 0.3.20 para mapeo objeto-relacional
• PostgreSQL como base de datos principal
• JSON Web Tokens (JWT) 9.0.2 para autenticación
• Passport.js 0.7.0 + Passport-JWT 4.0.1 para estrategias de auth
• Joi 17.13.3 para validación robusta de datos
• Bcrypt.js 2.4.3 para encriptación de contraseñas
• Nodemailer 7.0.5 para notificaciones por email
• CORS 2.8.5 para comunicación cross-origin
• Cookie-parser 1.0.0 para manejo de cookies HTTP-only
• Express-session 1.18.0 para gestión de sesiones
• Reflect-metadata 0.2.2 para decoradores TypeORM
```

### 🎨 **Frontend (React/Vite)**
```
• React 18.3.1 con hooks modernos
• Vite 5.4.1 como bundler y servidor de desarrollo
• React Router DOM 6.26.1 para navegación SPA
• React Hook Form 7.53.0 para formularios optimizados
• Axios 1.7.5 para comunicación HTTP con la API
• SweetAlert2 11.6.13 para alertas elegantes
• JWT-decode 4.0.0 para manejo de tokens
• JS-Cookie 3.0.5 para gestión de cookies
• FormKit Tempo 0.1.2 para manejo de fechas
• Lodash 4.17.21 para utilidades JavaScript
• RUT.js 2.1.0 para validación de RUT chileno
• CSS puro con diseño responsive y sistema unificado
```

### 🛠️ **Herramientas de desarrollo**
```
• ESLint 9.9.1 con configuración Google y Prettier
• Prettier 3.3.3 para formateo de código
• Nodemon 3.1.4 para desarrollo con hot reload
• Morgan 1.10.0 para logging de peticiones HTTP
• Docker con docker-compose para containerización
```

---

## 🏗️ Arquitectura del sistema

### **Backend (Node.js/Express)**
```
src/
├── controllers/     # Lógica de controladores REST API
├── services/        # Lógica de negocio y procesos complejos
├── entities/        # Modelos de base de datos (TypeORM)
├── middlewares/     # Autenticación, autorización y validaciones
├── validations/     # Esquemas de validación con Joi
├── routes/          # Definición de rutas y endpoints API
├── config/          # Configuración de BD, entorno y variables
├── auth/            # Configuración de Passport.js y estrategias
├── helpers/         # Utilidades (bcrypt, formateo, validadores)
└── handlers/        # Manejadores centralizados de respuesta HTTP
```

### **Frontend (React/Vite)**
```
src/
├── components/      # Componentes reutilizables (Form, Table, Navbar)
├── pages/           # Páginas principales (Login, Home, Users, etc.)
├── hooks/           # Custom hooks para lógica reutilizable
│   ├── auth/        # Hooks de autenticación (useLogin, useRegister)
│   ├── users/       # Hooks de usuarios (useGetUsers, useEditUser)
│   └── table/       # Hooks para manejo de tablas
├── services/        # Servicios para comunicación con API
├── context/         # Context API para estado global
├── helpers/         # Utilidades y formateadores
├── styles/          # Archivos CSS modulares por componente
└── assets/          # Recursos gráficos (iconos SVG)
```

---

## 🚀 Funcionalidades técnicas destacadas

- **🔄 Sistema de estados en tiempo real** con actualizaciones instantáneas
- **📧 Notificaciones automáticas** por email con plantillas personalizadas
- **🕒 Gestión inteligente de horarios** con validación de disponibilidad
- **🎨 Interfaz moderna** con sistema de diseño UBB unificado
- **⚡ API RESTful** con 49 endpoints documentados y validaciones robustas
- **🔍 Filtros avanzados** por categoría, marca, equipo y estado
- **📊 Dashboard administrativo** con métricas y estadísticas en tiempo real
- **🛡️ Seguridad multicapa** con JWT, bcrypt y validaciones frontend/backend
- **📱 Diseño responsive** optimizado para dispositivos móviles y desktop
- **🔐 Autenticación robusta** con dominios restringidos (@gmail.cl/@gmail.com)

---

## 📦 Scripts disponibles

### Backend
```bash
npm run start    # Producción
npm run dev      # Desarrollo con nodemon y hot reload
npm run lint     # Análisis de código con ESLint
npm run lint:fix # Corrección automática de errores ESLint
npm run format   # Formateo de código con Prettier
```

### Frontend
```bash
npm run dev      # Servidor de desarrollo con Vite
npm run build    # Build optimizado para producción
npm run preview  # Preview del build de producción
npm run lint     # Análisis de código con ESLint
```

---

## 🗄️ Base de datos - Entidades principales

| Entidad | Descripción |
|---------|-------------|
| **User** | Gestión de usuarios con roles (estudiante/administrador), autenticación y datos personales |
| **Equipo** | Inventario de equipos con modelo, serie, marca, categoría y estado de disponibilidad |
| **Prestamo** | Registro de solicitudes con fechas, horas, estados y observaciones del ciclo completo |
| **Categoria** | Clasificación de equipos (Notebooks, Proyectores, Tablets, Monitores) |
| **Marca** | Marcas de equipos (Lenovo, Apple, Dell, Epson) para organización del inventario |
| **EstadoPrestamo** | Estados del flujo: Pendiente, Aprobado, Rechazado, Entregado, Devuelto |
| **EstadoAltaBaja** | Estados de equipos: Activo, Inactivo, En Mantenimiento, Dado de Baja |
| **HoraDisponible** | Gestión de horarios disponibles por equipo y fecha para evitar conflictos |
| **TipoDocumento** | Tipos de documentos de identificación (RUT, Pasaporte, etc.) |

---

## 👥 Roles y permisos del sistema

| Rol | Permisos |
|-----|----------|
| **Administrador** | Gestión completa: usuarios, equipos, solicitudes, horarios, categorías, marcas y configuración |
| **Usuario/Estudiante** | Solicitar equipos, consultar disponibilidad, seguimiento de solicitudes personales |

---

## 🚧 Estado actual del proyecto

🔨 **En desarrollo activo** bajo metodología **incremental y ágil**

### ✅ **Completado:**
- Sistema de autenticación y autorización JWT completo
- Gestión completa de usuarios con roles diferenciados
- CRUD completo de equipos con categorías y marcas
- Sistema de solicitudes con flujo de estados automatizado
- Notificaciones automáticas por email con Nodemailer
- Interfaz administrativa completa con dashboard
- Panel de usuario funcional con historial
- Sistema de horarios disponibles por equipo
- Validaciones robustas frontend y backend
- Diseño responsive con sistema UBB unificado

### 🔄 **En desarrollo:**
- Testing automatizado y optimizaciones de rendimiento
- Mejoras en la experiencia de usuario
- Preparación para deploy en producción
- Documentación técnica y de usuario

---

## 🚀 Instalación y ejecución

### Prerrequisitos
- Node.js 18+ 
- PostgreSQL 12+
- Git

### Backend
```bash
cd backend
npm install
# Configurar variables de entorno en .env
npm run dev
```

### Frontend
```bash
cd frontend  
npm install
npm run dev
```

### Docker (Recomendado)
```bash
docker-compose up -d
```

---

## 📞 Información de contacto

**Universidad del Bío-Bío - Facultad de Ciencias Empresariales**
- 📧 Email: face@ubiobio.cl
- 🌐 Web: [www.ubiobio.cl](https://www.ubiobio.cl)
- 📍 Ubicación: Chillán, Chile

---

## 📄 Licencia

Este proyecto fue desarrollado como parte del **Taller de Desarrollo de Software 2025-1** en la Universidad del Bío-Bío.

---

*Desarrollado con ❤️ para optimizar la gestión de recursos tecnológicos en la FACE UBB*
