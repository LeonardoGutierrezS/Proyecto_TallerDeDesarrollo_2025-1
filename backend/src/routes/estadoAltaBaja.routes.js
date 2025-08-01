"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  createEstadoAltaBaja,
  deleteEstadoAltaBaja,
  getEstadoAltaBaja,
  getEstadosAltaBaja,
  updateEstadoAltaBaja,
} from "../controllers/estado-alta-baja.controller.js";

const router = Router();

router
  .use(authenticateJwt);

router
  .get("/", getEstadosAltaBaja)
  .get("/detail/", getEstadoAltaBaja)
  .post("/", isAdmin, createEstadoAltaBaja)
  .patch("/detail/", isAdmin, updateEstadoAltaBaja)
  .delete("/detail/", isAdmin, deleteEstadoAltaBaja);

export default router;
