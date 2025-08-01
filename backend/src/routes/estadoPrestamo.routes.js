"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  createEstadoPrestamo,
  deleteEstadoPrestamo,
  getEstadoPrestamo,
  getEstadosPrestamos,
  updateEstadoPrestamo,
} from "../controllers/estado-prestamo.controller.js";

const router = Router();

router
  .use(authenticateJwt);

router
  .get("/", getEstadosPrestamos)
  .get("/detail/", getEstadoPrestamo)
  .post("/", isAdmin, createEstadoPrestamo)
  .patch("/detail/", isAdmin, updateEstadoPrestamo)
  .delete("/detail/", isAdmin, deleteEstadoPrestamo);

export default router;
