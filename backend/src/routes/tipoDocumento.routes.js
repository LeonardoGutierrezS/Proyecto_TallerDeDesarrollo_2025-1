"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  createTipoDocumento,
  deleteTipoDocumento,
  getTipoDocumento,
  getTiposDocumentos,
  updateTipoDocumento,
} from "../controllers/tipo-documento.controller.js";

const router = Router();

router
  .use(authenticateJwt);

router
  .get("/", getTiposDocumentos)
  .get("/detail/", getTipoDocumento)
  .post("/", isAdmin, createTipoDocumento)
  .patch("/detail/", isAdmin, updateTipoDocumento)
  .delete("/detail/", isAdmin, deleteTipoDocumento);

export default router;
