"use strict";
import { Router } from "express";

// Rutas de autenticación y usuarios
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";

// Rutas de catálogos base
import carreraRoutes from "./carrera.routes.js";
import marcaRoutes from "./marca.routes.js";
import estadoRoutes from "./estado.routes.js";
import categoriaRoutes from "./categoria.routes.js";

// Rutas de equipos
import equiposRoutes from "./equipos.routes.js";
import caracteristicasEquipoRoutes from "./caracteristicas_equipo.routes.js";

// Rutas del sistema de préstamos (3FN)
import solicitudRoutes from "./solicitud.routes.js";
import autorizacionRoutes from "./autorizacion.routes.js";
import prestamoRoutes from "./prestamo.routes.js";
import devolucionRoutes from "./devolucion.routes.js";
import tieneEstadoRoutes from "./tiene_estado.routes.js";

// Rutas de penalizaciones
import penalizacionesRoutes from "./penalizaciones.routes.js";
import tienePenalizacionRoutes from "./tiene_penalizacion.routes.js";

// Rutas de clasificaciones de usuarios
import cargoRoutes from "./cargo.routes.js";
import tipoUsuarioRoutes from "./tipo_usuario.routes.js";

const router = Router();

// Autenticación y usuarios
router
  .use("/auth", authRoutes)
  .use("/user", userRoutes);

// Catálogos base
router
  .use("/carrera", carreraRoutes)
  .use("/marca", marcaRoutes)
  .use("/estado", estadoRoutes)
  .use("/categoria", categoriaRoutes);

// Equipos
router
  .use("/equipos", equiposRoutes)
  .use("/caracteristicas-equipo", caracteristicasEquipoRoutes);

// Sistema de préstamos (3FN)
router
  .use("/solicitud", solicitudRoutes)
  .use("/autorizacion", autorizacionRoutes)
  .use("/prestamo", prestamoRoutes)
  .use("/devolucion", devolucionRoutes)
  .use("/tiene-estado", tieneEstadoRoutes);

// Sistema de penalizaciones
router
  .use("/penalizaciones", penalizacionesRoutes)
  .use("/tiene-penalizacion", tienePenalizacionRoutes);

// Clasificaciones de usuarios
router
  .use("/cargo", cargoRoutes)
  .use("/tipo-usuario", tipoUsuarioRoutes);

export default router;