"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  createEstadoPrestamo,
  getEstadoPrestamo,
  getEstadosPrestamos,
  updateEstadoPrestamo,
  deleteEstadoPrestamo,
} from "../controllers/estado_prestamo.controller.js";

const router = Router();

router.use(authenticateJwt);

// Rutas públicas (para usuarios autenticados)
router.get("/", getEstadosPrestamos);
router.get("/:id", getEstadoPrestamo);

// Rutas protegidas (solo administradores)
router.use(isAdmin);
router.post("/", createEstadoPrestamo);
router.put("/:id", updateEstadoPrestamo);
router.delete("/:id", deleteEstadoPrestamo);

export default router;
