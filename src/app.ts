import express from "express";
import { apiLogHandler } from "./middlewares/globalMiddleware";
import { errorHandler } from "./middlewares/globalMiddleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ENV } from "./env";
import { apiRateLimiter } from "./middlewares/rateLimitMiddleware";

const app = express();

// global middleware
app.use(cors({
  origin: ENV.corsOrigin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// api rate limiting a user only can make 100 req per 15 mint
app.use(apiRateLimiter);

// logger
app.use(apiLogHandler);

// health check
app.get("/api/health", (_, res) => {
  res.status(200).send("OK");
})

// routes
import userRouter from "./routes/userRouter";
import eventRouter from "./routes/eventRouter";
import bookingRouter from "./routes/bookingRouter";
import authRouter from "./routes/authRouter";
import paymentRouter from "./routes/paymentRouter";

app.use("/api/users", userRouter);
app.use("/api/events", eventRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/auth", authRouter);
app.use("/api/payments", paymentRouter);

// global error handler
app.use(errorHandler);

export { app };