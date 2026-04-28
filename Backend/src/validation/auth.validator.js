import { ExpressValidator } from "express-validator";

export const authValidator = {
  register: [
    ExpressValidator.body("email").isEmail().withMessage("Invalid email address"),
    ExpressValidator.body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    ExpressValidator.body("name").notEmpty().withMessage("Name is required"),
      