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

  golangServerUrl: String(process.env.GOLANG_SERVER_URL),
  clientUrl: String(process.env.CLIENT_URL),

  smtpHost: String(process.env.BREVO_SMTP_HOST),
  smtpPort: String(process.env.BREVO_SMTP_PORT),
  smtpUser: String(process.env.BREVO_SMTP_LOGIN),
  smtpPass: String(process.env.BREVO_SMTP_API_KEY),
  smtpSender: String(process.env.BREVO_SMTP_SENDER),
}

export const ENV = Object.freeze(_env);