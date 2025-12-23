import { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger";


const apiLogHandler = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    logger
      .info(`method=${req.method} path=${req.path} status=${res.statusCode} latency=${duration}ms`);
  })
  next();
}

export {
  apiLogHandler
}