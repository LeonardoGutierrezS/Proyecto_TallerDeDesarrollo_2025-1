"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createSolicitudController,
  getSolicitudesController,
  getSolicitudesPorUsuarioController,
  getSolicitudesPorPrestamoController,
  getSolicitudController,
  deleteSolicitudController,
} from "../controllers/solicitud.controller.js";

const router = Router();

router.use(authenticateJwt);

router
  .post("/", createSolicitudController)
  .get("/", getSolicitudesController)
  .get("/prestamo/:idPrestamo", getSolicitudesPorPrestamoController)
  .get("/usuario/:rut", getSolicitudesPorUsuarioController)
  .get("/:rut/:idPrestamo", getSolicitudController)
  .delete("/:rut/:idPrestamo", deleteSolicitudController);

export default router;
