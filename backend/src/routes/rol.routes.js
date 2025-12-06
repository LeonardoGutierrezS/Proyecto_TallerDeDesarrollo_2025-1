"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  createRol,
  getRol,
  getRoles,
  updateRol,
  deleteRol,
} from "../controllers/rol.controller.js";

const router = Router();

router.use(authenticateJwt);

// Rutas públicas (para usuarios autenticados)
router.get("/", getRoles);
router.get("/:id", getRol);

// Rutas protegidas (solo administradores)
router.use(isAdmin);
router.post("/", createRol);
router.put("/:id", updateRol);
router.delete("/:id", deleteRol);

export default router;
