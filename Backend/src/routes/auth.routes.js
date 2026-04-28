import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter
  .route("/login")
  .post(authController.login);

authRouter
  .route("/signup")
  .post(authController.signup);


export default authRouter;