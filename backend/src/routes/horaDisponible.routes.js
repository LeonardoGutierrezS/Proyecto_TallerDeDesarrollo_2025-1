"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  createHoraDisponible,
  deleteHoraDisponible,
  generarHoras,
  getHoraDisponible,
  getHorasDisponibles,
  getHorasDisponiblesByEquipo,
  getHorasRealmenteDisponiblesByEquipo,
  getRangosHorariosDisponibles,
  getHorasDisponiblesByFecha,
  updateHoraDisponible,
} from "../controllers/hora-disponible.controller.js";

const router = Router();

router
  .use(authenticateJwt);

router
  .get("/", getHorasDisponibles)
  .get("/detail/", getHoraDisponible)
  .get("/equipo/", getHorasDisponiblesByEquipo)
  .get("/equipo/disponibles/", getHorasRealmenteDisponiblesByEquipo)
  .get("/equipo/rangos/", getRangosHorariosDisponibles)
  .get("/fecha/", getHorasDisponiblesByFecha)
  .post("/", isAdmin, createHoraDisponible)
  .post("/generar", isAdmin, generarHoras)
  .patch("/detail/", isAdmin, updateHoraDisponible)
  .delete("/detail/", isAdmin, deleteHoraDisponible);

export default router;
