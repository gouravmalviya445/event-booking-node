import dotenv from "dotenv";

dotenv.config();

const _env = {
  nodeEnv: String(process.env.NODE_ENV),
  
  port: String(process.env.PORT),
  corsOrigin: String(process.env.CORS_ORIGIN),

  mongodbUrl: String(process.env.MONGODB_URL),
  dbName: String(process.env.DB_NAME),

  jwtSecret: String(process.env.JWT_SECRET),
  jwtExpiry: String(process.env.JWT_EXPIRY),
}

export const ENV = Object.freeze(_env);