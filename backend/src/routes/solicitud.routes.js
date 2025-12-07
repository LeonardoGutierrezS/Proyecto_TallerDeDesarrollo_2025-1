"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createSolicitudController,
  getSolicitudesController,
  getSolicitudesPorUsuarioController,
  getSolicitudesPendientesController,
  getSolicitudController,
  deleteSolicitudController,
} from "../controllers/solicitud.controller.js";

const router = Router();

router.use(authenticateJwt);

router
  .post("/", createSolicitudController)
  .get("/", getSolicitudesController)
  .get("/pendientes", getSolicitudesPendientesController)
  .get("/usuario/:rut", getSolicitudesPorUsuarioController)
  .get("/:id", getSolicitudController)
  .delete("/:id", deleteSolicitudController);

export default router;
