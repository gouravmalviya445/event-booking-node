import { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger";
import { ApiError, StatusCodes } from "../utils/ApiError";

// API Logger middleware
const apiLogHandler = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const requestMeta = {
      method: req.method,
      path: req.originalUrl,
      params: req.params,
      query: req.query,
      statusCode: res.statusCode,
      latencyMs: Date.now() - startTime,
    };

    if (res.statusCode < 400) {
      logger.info(requestMeta, "Request completed");
      return;
    }

    logger.warn(
      {
        ...requestMeta,
        message: `${req.method} ${req.originalUrl} failed with ${res.statusCode}`,
      },
      "Request failed"
    );
  });

  next();
};

// ERROR handler middleware
const errorHandler = (
  err: ApiError | Error,
  req: Request,
  res: Response,
  _: NextFunction
) => {
  let error = err;

  // If it's not already an ApiError, wrap it
  if (!(err instanceof ApiError)) {
    error = new ApiError(
      (err as any)?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      err.message,
      (err as any)?.errors || [],
      err.stack
    );
  }

  const apiError = error as ApiError;

  // response
  const response = {
    statusCode: apiError.statusCode,
    success: apiError.success,
    message: apiError.message,
    errors: apiError.errors,
    data: apiError.data,
    ...(process.env.NODE_ENV !== "production" && { stack: apiError.stack }),
  };

  // Log error
  logger.error(
    {
      method: req.method,
      path: req.originalUrl,
      statusCode: apiError.statusCode,
      message: apiError.message,
      params: req.params,
      query: req.query,
      errors: apiError.errors,
      stack: apiError.stack,
    },
    "Unhandled error"
  );

  res.status(apiError.statusCode).json(response);
};

export {
  apiLogHandler,
  errorHandler
}