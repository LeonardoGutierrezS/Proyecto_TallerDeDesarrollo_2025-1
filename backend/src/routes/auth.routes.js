"use strict";
import { Router } from "express";
import { 
  login, 
  logout, 
  register, 
  forgotPassword, 
  validateResetToken, 
  resetPassword 
} from "../controllers/auth.controller.js";

const router = Router();

router
  .post("/login", login)
  .post("/register", register)
  .post("/logout", logout)
  .post("/forgot-password", forgotPassword)
  .get("/validate-reset-token", validateResetToken)
  .post("/reset-password", resetPassword);

export default router;
