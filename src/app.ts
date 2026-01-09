import express from "express";
import { apiLogHandler } from "./middlewares/globalMiddleware";
import { errorHandler } from "./middlewares/globalMiddleware";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

// global middleware
app.use(cors({
  origin: ENV.corsOrigin
}));
app.use()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// logger
app.use(apiLogHandler);

// health check
app.get("/api/health", (_, res) => {
  res.status(200).send("OK");
})

// routes
import userRouter from "./routes/userRouter";
import eventRouter from "./routes/eventRouter"
import bookingRouter from "./routes/bookingRouter";
import { ENV } from "./env";

app.use("/api/users", userRouter);
app.use("/api/events", eventRouter);
app.use("/api/bookings", bookingRouter);

// global error handler
app.use(errorHandler);

export { app };