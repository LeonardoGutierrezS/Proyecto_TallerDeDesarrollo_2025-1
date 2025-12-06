"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  createDetallesNotebook,
  getDetallesNotebook,
  getDetallesNotebookPorEquipo,
  getAllDetallesNotebooks,
  updateDetallesNotebook,
  deleteDetallesNotebook,
} from "../controllers/detalles_notebook.controller.js";

const router = Router();

router.use(authenticateJwt);

// Rutas públicas (para usuarios autenticados)
router.get("/", getAllDetallesNotebooks);
router.get("/:id", getDetallesNotebook);
router.get("/equipo/:equipoId", getDetallesNotebookPorEquipo);

// Rutas protegidas (solo administradores)
router.use(isAdmin);
router.post("/", createDetallesNotebook);
router.put("/:id", updateDetallesNotebook);
router.delete("/:id", deleteDetallesNotebook);

export default router;
