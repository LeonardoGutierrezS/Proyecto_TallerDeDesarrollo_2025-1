"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createTieneEstadoController,
  getHistorialEstadosController,
  getEstadoActualController,
} from "../controllers/tiene_estado.controller.js";

const router = Router();

router.use(authenticateJwt);

router
  .post("/", createTieneEstadoController)
  .get("/historial/:idPrestamo", getHistorialEstadosController)
  .get("/actual/:idPrestamo", getEstadoActualController);

export default router;
