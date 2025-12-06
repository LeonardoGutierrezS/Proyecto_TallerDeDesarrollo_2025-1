"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  createTipoDocumento,
  getTipoDocumento,
  getTiposDocumento,
  updateTipoDocumento,
  deleteTipoDocumento,
} from "../controllers/tipo_documento.controller.js";

const router = Router();

router.use(authenticateJwt);

// Rutas públicas (para usuarios autenticados)
router.get("/", getTiposDocumento);
router.get("/:id", getTipoDocumento);

// Rutas protegidas (solo administradores)
router.use(isAdmin);
router.post("/", createTipoDocumento);
router.put("/:id", updateTipoDocumento);
router.delete("/:id", deleteTipoDocumento);

export default router;
