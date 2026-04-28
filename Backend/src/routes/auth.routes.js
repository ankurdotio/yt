import { Router } from "express";
import {} from "../controllers/auth.controller.js";
import bcrypt from "bcrypt";

const authRouter = Router();

authRouter
  .route("/login")
  .post();

authRouter
  .route("/signup")
  .post((req,res)=>{
    const { name, username, email, password } = req.body;


  });


export default authRouter;