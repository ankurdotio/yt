import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import userModel from "../models/user.model.js";

export const login = async (req,res) => {
  try {
    const { username, password } = req.body;
    if (!req.body.username || !req.body.password) {
      throw new Error("Username and password are required");
    }
    // database query username and password check karo DB me
    const user = await userModel.findOne({ username });
    if (!user) {
      throw new Error("Invalid username or password");
    }

    bcrypt.verify(user.password, password, (err, result) => {
      if (err) {
        res.sendStatus(500).json({ error: "Error verifying password" });
        throw new Error("Error verifying password");
      }
      if (!result) {
        res.sendStatus(401).json({ error: "Invalid username or password" });
        throw new Error("Invalid username or password");
      }
    });

    res.cookie("token", "token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({      
      success: true,
      message: "Login successful",
      data:{
        username: user.username,
        email: user.email,

      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

const signup = async (req,res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new Error("Username, email, and password are required");
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        res.sendStatus(500).json({ error: "Error hashing password" });
        throw new Error("Error hashing password");
      }
      // database me user create karo with hashed password
      const newUser = new User({
        username, 
        email,
        password: hash,
      });

      await newUser.save();

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          username: newUser.username,
          email: newUser.email,
        },
      });
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export default {
  login,
  signup,
}