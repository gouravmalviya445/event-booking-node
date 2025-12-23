import { Request, Response, NextFunction } from "express";

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>

function asyncHandler(
  asyncFunc: AsyncFunction
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(asyncFunc(req, res, next)).catch(err => next(err));
  }
}

export { asyncHandler }