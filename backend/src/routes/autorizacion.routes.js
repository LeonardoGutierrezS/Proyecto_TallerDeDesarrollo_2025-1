"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  aprobarSolicitudController,
  rechazarSolicitudController,
  getAutorizacionesController,
} from "../controllers/autorizacion.controller.js";

const router = Router();

router.use(authenticateJwt);
router.use(isAdmin);

router
  .post("/aprobar", aprobarSolicitudController)
  .post("/rechazar", rechazarSolicitudController)
  .get("/", getAutorizacionesController);

export default router;
