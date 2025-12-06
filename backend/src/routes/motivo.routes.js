"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  createMotivo,
  getMotivo,
  getMotivos,
  updateMotivo,
  deleteMotivo,
} from "../controllers/motivo.controller.js";

const router = Router();

router.use(authenticateJwt);

// Rutas públicas (para usuarios autenticados)
router.get("/", getMotivos);
router.get("/:id", getMotivo);

// Rutas protegidas (solo administradores)
router.use(isAdmin);
router.post("/", createMotivo);
router.put("/:id", updateMotivo);
router.delete("/:id", deleteMotivo);

export default router;
