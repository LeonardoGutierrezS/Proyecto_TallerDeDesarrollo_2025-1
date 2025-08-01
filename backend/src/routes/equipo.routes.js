"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  createEquipo,
  deleteEquipo,
  getEquipo,
  getEquipos,
  getEquiposByCategoria,
  getEquiposByMarca,
  updateEquipo,
} from "../controllers/equipo.controller.js";

const router = Router();

router
  .use(authenticateJwt);

router
  .get("/", getEquipos)
  .get("/detail/", getEquipo)
  .get("/categoria/", getEquiposByCategoria)
  .get("/marca/", getEquiposByMarca)
  .post("/", isAdmin, createEquipo)
  .patch("/detail/", isAdmin, updateEquipo)
  .delete("/detail/", isAdmin, deleteEquipo);

export default router;
