import rateLimit from "express-rate-limit";

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // limit each IP to 100 requests per windowMs
  message: {message: "Too many requests, please try again after 15 minutes"},
  standardHeaders: true,
  legacyHeaders: false,
})

const otpRateLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  limit: 1, // limit each IP to 1 request
  message: { message: "Please wait for 30 seconds before making another OTP request"},
  standardHeaders: true,
  legacyHeaders: false
})

export {
  apiRateLimiter,
  otpRateLimiter
}