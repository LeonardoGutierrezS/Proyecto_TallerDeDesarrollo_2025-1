# Sistema de Navegación Lateral - SIREC_V3

## 📐 Estructura del Navbar Lateral

### Diseño
- **Posición**: Fijo en el lateral izquierdo
- **Ancho**: 280px en desktop
- **Color**: Gradiente azul (#003366 a #002651)
- **Responsive**: Se oculta en móvil con menú hamburguesa

### Secciones del Sidebar

#### 1. Header
- Logo "SIREC"
- Nombre del usuario
- Rol del usuario (capitalizado)

#### 2. Navegación

#### Para todos los usuarios:
- **Inicio** (🏠) - Página principal

#### Para Administrador:
- **Gestión de Usuarios** (👥) - Administrar usuarios
- **Gestión de Equipos** (💻) - Administrar equipos
- **Gestión de Solicitudes** (📋) - Administrar solicitudes

#### Para Alumno/Profesor:
- **Generar Solicitud** (➕) - Crear nueva solicitud
- **Estado de Solicitud** (📊) - Ver estado de solicitudes

#### Para todos:
- **Cerrar Sesión** (🚪) - Salir del sistema

---

## 📄 Páginas Creadas

### Páginas de Administrador

#### 1. **GestionUsuarios.jsx** (`/gestion-usuarios`)
- **Ruta**: `/gestion-usuarios`
- **Rol requerido**: Administrador
- **Estado**: Página en blanco (pendiente implementación)
- **Descripción**: Gestión completa de usuarios del sistema

#### 2. **GestionEquipos.jsx** (`/gestion-equipos`)
- **Ruta**: `/gestion-equipos`
- **Rol requerido**: Administrador
- **Estado**: Página en blanco (pendiente implementación)
- **Descripción**: Gestión del inventario de equipos

#### 3. **GestionSolicitudes.jsx** (`/gestion-solicitudes`)
- **Ruta**: `/gestion-solicitudes`
- **Rol requerido**: Administrador
- **Estado**: Página en blanco (pendiente implementación)
- **Descripción**: Gestión de solicitudes de préstamos

### Páginas de Alumno/Profesor

#### 4. **GenerarSolicitud.jsx** (`/generar-solicitud`)
- **Ruta**: `/generar-solicitud`
- **Roles requeridos**: Alumno, Profesor
- **Estado**: Página en blanco (pendiente implementación)
- **Descripción**: Formulario para crear nuevas solicitudes de préstamo

#### 5. **EstadoSolicitud.jsx** (`/estado-solicitud`)
- **Ruta**: `/estado-solicitud`
- **Roles requeridos**: Alumno, Profesor
- **Estado**: Página en blanco (pendiente implementación)
- **Descripción**: Visualización del estado de solicitudes propias

---

## 🎨 Archivos Modificados

### Frontend

#### 1. **Navbar.jsx**
**Cambios principales:**
- ✅ Convertido de navbar superior a sidebar lateral
- ✅ Agregada información del usuario (nombre y rol)
- ✅ Implementado menú hamburguesa para móvil
- ✅ Iconos para cada opción del menú
- ✅ Overlay para cerrar menú en móvil
- ✅ NavLink con estado activo automático

**Nuevas funcionalidades:**
```jsx
- userName y userRole desde sessionStorage
- Menú desplegable en móvil con estado open/closed
- Iconos emoji para cada opción
- NavLink con className dinámica ({ isActive })
```

#### 2. **navbar.css**
**Cambios principales:**
- ✅ Estilos completamente rediseñados para sidebar
- ✅ Animaciones y transiciones suaves
- ✅ Sidebar fijo con scroll interno
- ✅ Responsive con hamburger menu
- ✅ Overlay oscuro en móvil
- ✅ Scrollbar personalizado

**Estructura CSS:**
```css
.sidebar - Contenedor principal
.sidebar-header - Logo y info de usuario
.sidebar-nav - Navegación con scroll
.hamburger - Menú móvil
.overlay - Fondo oscuro móvil
```

#### 3. **styles.css**
**Agregados:**
```css
.main-container - Contenedor con margen para sidebar (280px)
  - Padding: 40px
  - Width: calc(100% - 280px)
  - Responsive: margin 0 en móvil
```

#### 4. **users.css**
**Cambios:**
- ✅ Renombrado `.main-container` a `.users-main-container`
- ✅ Ajustes de márgenes para el sidebar
- ✅ Mejoras responsive
- ✅ Eliminados márgenes innecesarios

#### 5. **main.jsx**
**Rutas agregadas:**
```jsx
// Rutas de Administrador
{
  path: '/gestion-usuarios',
  element: <ProtectedRoute allowedRoles={['administrador']}>
    <GestionUsuarios />
  </ProtectedRoute>
},
{
  path: '/gestion-equipos',
  element: <ProtectedRoute allowedRoles={['administrador']}>
    <GestionEquipos />
  </ProtectedRoute>
},
{
  path: '/gestion-solicitudes',
  element: <ProtectedRoute allowedRoles={['administrador']}>
    <GestionSolicitudes />
  </ProtectedRoute>
},

// Rutas de Alumno/Profesor
{
  path: '/generar-solicitud',
  element: <ProtectedRoute allowedRoles={['alumno', 'profesor']}>
    <GenerarSolicitud />
  </ProtectedRoute>
},
{
  path: '/estado-solicitud',
  element: <ProtectedRoute allowedRoles={['alumno', 'profesor']}>
    <EstadoSolicitud />
  </ProtectedRoute>
}
```

#### 6. **Root.jsx**
**Cambios:**
- ✅ Layout flex con sidebar y contenido
- ✅ Contenedor principal con flex: 1

#### 7. **Home.jsx**
**Actualizado:**
- ✅ Usa el nuevo `.main-container`
- ✅ Muestra información del usuario
- ✅ Mensaje de bienvenida personalizado

---

## 📱 Comportamiento Responsive

### Desktop (>1024px)
- Sidebar siempre visible (280px)
- Contenido con margen izquierdo de 280px
- Menú hamburguesa oculto

### Tablet (768px - 1024px)
- Sidebar oculto por defecto
- Menú hamburguesa visible
- Overlay al abrir sidebar
- Sidebar se desliza desde la izquierda

### Mobile (<768px)
- Sidebar oculto por defecto
- Menú hamburguesa visible (top-left)
- Overlay oscuro al abrir
- Contenido ocupa 100% del ancho
- Padding reducido

---

## 🎯 Características Implementadas

### ✅ Navegación Inteligente
- NavLink con estado activo automático
- Resaltado visual de página actual
- Transiciones suaves entre páginas

### ✅ Control de Acceso
- Opciones visibles según rol de usuario
- ProtectedRoute en todas las páginas de admin
- Redirección automática si no autorizado

### ✅ Experiencia de Usuario
- Información del usuario siempre visible
- Iconos intuitivos para cada sección
- Hover effects en todos los links
- Scroll personalizado en el sidebar

### ✅ Responsive Design
- Menú hamburguesa en móvil/tablet
- Overlay para cerrar menú
- Ajuste automático del contenido
- Touch-friendly en dispositivos móviles

---

## 🚀 Próximos Pasos

### Gestión de Usuarios
- [ ] Tabla de usuarios pendientes de aprobación
- [ ] Botones aprobar/rechazar usuarios
- [ ] Filtros y búsqueda avanzada
- [ ] Edición de roles y carreras
- [ ] Activar/desactivar usuarios (Vigente)

### Gestión de Equipos
- [ ] Inventario de equipos disponibles
- [ ] Agregar/editar/eliminar equipos
- [ ] Estados de equipos (disponible, prestado, mantenimiento)
- [ ] Historial de préstamos por equipo
- [ ] Filtros por tipo, marca, estado

### Gestión de Solicitudes (Administrador)
- [ ] Lista de solicitudes pendientes
- [ ] Aprobar/rechazar solicitudes
- [ ] Historial de préstamos
- [ ] Estadísticas de préstamos
- [ ] Gestión de devoluciones

### Generar Solicitud (Alumno/Profesor)
- [ ] Formulario de nueva solicitud
- [ ] Selección de equipo disponible
- [ ] Fecha y hora de préstamo
- [ ] Motivo del préstamo
- [ ] Validación de disponibilidad

### Estado de Solicitud (Alumno/Profesor)
- [ ] Lista de solicitudes propias
- [ ] Estado actual (pendiente, aprobada, rechazada)
- [ ] Historial de préstamos anteriores
- [ ] Detalles de cada solicitud
- [ ] Notificaciones de cambios de estado

---

## 📋 Testing Checklist

- [ ] Navegación funciona correctamente en desktop
- [ ] Menú hamburguesa funciona en móvil
- [ ] Overlay cierra el menú al hacer click
- [ ] NavLink activo se resalta correctamente
- [ ] Usuarios no admin no ven opciones de admin
- [ ] Logout funciona correctamente
- [ ] Páginas protegidas requieren autenticación
- [ ] Responsive design funciona en todos los tamaños
- [ ] Scroll del sidebar funciona correctamente
- [ ] Información de usuario se muestra correctamente

---

## 🎨 Paleta de Colores

```css
Azul Oscuro Principal: #003366
Azul Muy Oscuro: #002651
Azul Claro: #006edf
Azul Muy Claro: #eef7ff
Azul Medio: #a8c5e0
Rojo Salir: #ff6b6b
```

---

## 💡 Notas Técnicas

1. **SessionStorage**: Se usa para almacenar información del usuario
2. **ProtectedRoute**: Componente que valida roles antes de renderizar
3. **NavLink**: Proporciona className con isActive para estado activo
4. **CSS Modules**: Cada página tiene su propio CSS para evitar conflictos
5. **Flexbox**: Layout principal usa flexbox para sidebar + contenido
