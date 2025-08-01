"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  createMarca,
  deleteMarca,
  getMarca,
  getMarcas,
  updateMarca,
} from "../controllers/marca.controller.js";

const router = Router();

router
  .use(authenticateJwt);

router
  .get("/", getMarcas)
  .get("/detail/", getMarca)
  .post("/", isAdmin, createMarca)
  .patch("/detail/", isAdmin, updateMarca)
  .delete("/detail/", isAdmin, deleteMarca);

export default router;
