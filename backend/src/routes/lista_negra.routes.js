"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  createListaNegra,
  getListaNegra,
  getListaNegras,
  getListaNegrasActivas,
  getListaNegraPorUsuario,
  verificarUsuarioEnListaNegra,
  updateListaNegra,
  levantarListaNegra,
  deleteListaNegra,
} from "../controllers/lista_negra.controller.js";

const router = Router();

router.use(authenticateJwt);
router.use(isAdmin);

// Todas las rutas de lista negra requieren permisos de administrador
router.get("/", getListaNegras);
router.get("/activas", getListaNegrasActivas);
router.get("/usuario/:usuarioId", getListaNegraPorUsuario);
router.get("/verificar/:usuarioId", verificarUsuarioEnListaNegra);
router.get("/:id", getListaNegra);
router.post("/", createListaNegra);
router.put("/:id", updateListaNegra);
router.patch("/:id/levantar", levantarListaNegra);
router.delete("/:id", deleteListaNegra);

export default router;
