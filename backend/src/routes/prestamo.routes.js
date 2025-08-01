"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  aprobarPrestamo,
  createPrestamo,
  deletePrestamo,
  devolverPrestamo,
  entregarPrestamo,
  getPrestamo,
  getPrestamos,
  getPrestamosByEstado,
  getPrestamosByUsuario,
  rechazarPrestamo,
  updatePrestamo,
} from "../controllers/prestamo.controller.js";

const router = Router();

router
  .use(authenticateJwt);

router
  .get("/", getPrestamos)
  .get("/detail/", getPrestamo)
  .get("/my-prestamos/", getPrestamosByUsuario)
  .get("/estado/:estadoId", getPrestamosByEstado)
  .get("/user/", isAdmin, getPrestamosByUsuario)
  .post("/", createPrestamo)
  .patch("/detail/", isAdmin, updatePrestamo)
  .patch("/approve/", isAdmin, aprobarPrestamo)
  .patch("/reject/", isAdmin, rechazarPrestamo)
  .patch("/deliver/", isAdmin, entregarPrestamo)
  .patch("/return/", isAdmin, devolverPrestamo)
  .delete("/detail/", isAdmin, deletePrestamo);

export default router;
