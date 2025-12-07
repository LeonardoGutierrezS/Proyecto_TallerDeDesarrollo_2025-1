"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  createCaracteristicaController,
  getCaracteristicasPorEquipoController,
  updateCaracteristicaController,
  deleteCaracteristicaController,
} from "../controllers/caracteristicas_equipo.controller.js";

const router = Router();

router.use(authenticateJwt);

// Rutas públicas (autenticadas) - consulta
router.get("/equipo/:idNumInv", getCaracteristicasPorEquipoController);

// Rutas de administrador - modificación
router.use(isAdmin);

router
  .post("/", createCaracteristicaController)
  .patch("/:id", updateCaracteristicaController)
  .delete("/:id", deleteCaracteristicaController);

export default router;
