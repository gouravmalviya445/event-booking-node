import dotenv from "dotenv";

dotenv.config();

const _env = {
  port: process.env.PORT,
  corsOrigin: String(process.env.CORS_ORIGIN),

  mongodbUrl: String(process.env.MONGODB_URL),

  jwtSecret: String(process.env.JWT_SECRET),
  jwtExpiry: String(process.env.JWT_EXPIRES_IN)
}
console.log(_env.corsOrigin)

export const ENV = Object.freeze(_env);