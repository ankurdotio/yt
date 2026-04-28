import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  dbUri: process.env.DB_URI || "mongodb://localhost:27017/myapp",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
};  

export default Object.freeze(config);