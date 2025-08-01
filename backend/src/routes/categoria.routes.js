"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  createCategoria,
  deleteCategoria,
  getCategoria,
  getCategorias,
  updateCategoria,
} from "../controllers/categoria.controller.js";

const router = Router();

router
  .use(authenticateJwt);

router
  .get("/", getCategorias)
  .get("/detail/", getCategoria)
  .post("/", isAdmin, createCategoria)
  .patch("/detail/", isAdmin, updateCategoria)
  .delete("/detail/", isAdmin, deleteCategoria);

export default router;
