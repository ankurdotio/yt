import { body } from "express-validator";

const signupValidator = [
  body("username")
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3, max: 20 }).withMessage("Username must be 3-20 characters")
    .trim(),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];

const loginValidator = [
  body("username")
    .notEmpty().withMessage("Username is required"),

  body("password")
    .notEmpty().withMessage("Password is required")
];

export default {
  signupValidator,
  loginValidator
}