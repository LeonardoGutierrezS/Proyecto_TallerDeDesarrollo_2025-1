"use strict";
import { Router } from "express";

// Rutas de autenticación y usuarios
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";

// Rutas de catálogos
import rolRoutes from "./rol.routes.js";
import carreraRoutes from "./carrera.routes.js";
import motivoRoutes from "./motivo.routes.js";
import tipoDocumentoRoutes from "./tipo_documento.routes.js";
import marcaRoutes from "./marca.routes.js";
import estadoRoutes from "./estado.routes.js";
import categoriaRoutes from "./categoria.routes.js";
import estadoPrestamoRoutes from "./estado_prestamo.routes.js";

// Rutas principales
import equiposRoutes from "./equipos.routes.js";
import detallesNotebookRoutes from "./detalles_notebook.routes.js";
import prestamoRoutes from "./prestamo.routes.js";
import listaNegraRoutes from "./lista_negra.routes.js";

const router = Router();

// Autenticación y usuarios
router
  .use("/auth", authRoutes)
  .use("/user", userRoutes);

// Catálogos
router
  .use("/rol", rolRoutes)
  .use("/carrera", carreraRoutes)
  .use("/motivo", motivoRoutes)
  .use("/tipo-documento", tipoDocumentoRoutes)
  .use("/marca", marcaRoutes)
  .use("/estado", estadoRoutes)
  .use("/categoria", categoriaRoutes)
  .use("/estado-prestamo", estadoPrestamoRoutes);

// Entidades principales
router
  .use("/equipos", equiposRoutes)
  .use("/detalles-notebook", detallesNotebookRoutes)
  .use("/prestamo", prestamoRoutes)
  .use("/lista-negra", listaNegraRoutes);

export default router;