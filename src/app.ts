import express from "express";
import { apiLogHandler } from "./middlewares/globalMiddleware";
import { errorHandler } from "./middlewares/globalMiddleware";
const app = express();

// global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// logger
app.use(apiLogHandler);

// health check
app.get("/api/health", (_, res) => {
  res.status(200).send("OK");
})

// routes

// global error handler
app.use(errorHandler);

export { app };