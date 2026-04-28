import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import authValidator from "../validation/auth.validator.js";
import { validateRequest } from '../utils/validate.js';

const authRouter = Router();

authRouter.post(
  "/signup",
  authValidator.signupValidator,
  validateRequest,
  authController.signup
);

authRouter.post(
  "/login",
  authValidator.loginValidator,
  validateRequest,
  authController.login
);

export default authRouter;