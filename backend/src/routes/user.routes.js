"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  approveUser,
  createUserByAdmin,
  deleteUser,
  getAllUsers,
  getPendingUsers,
  getUser,
  getUsers,
  rejectUser,
  updateUser,
  updateUserStatus,
} from "../controllers/user.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(isAdmin);

router
  .get("/", getUsers)
  .get("/all", getAllUsers)
  .get("/pending", getPendingUsers)
  .get("/detail/", getUser)
  .post("/create", createUserByAdmin)
  .patch("/detail/", updateUser)
  .patch("/:id/approve", approveUser)
  .patch("/:id/status", updateUserStatus)
  .delete("/detail/", deleteUser)
  .delete("/:id/reject", rejectUser);

export default router;