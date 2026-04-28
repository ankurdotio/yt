import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import authValidator from "../validation/auth.validator.js";
import { validate } from "../utils/validate.js";

const authRouter = Router();

authRouter.post(
  "/signup",
  authValidator.signupValidator,
  validate,
  authController.signup
);

authRouter.post(
  "/login",
  authValidator.loginValidator,
  validate,
  authController.login
);

export default authRouter;