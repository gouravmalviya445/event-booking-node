import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError, StatusCodes } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { ENV } from "../env";
import { IUser, User } from "../models/userModel";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const userAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken || req.get("Authorization")?.replace("Bearer ", "");

    let statusCode = StatusCodes.UNAUTHORIZED;
    if (!accessToken) {
      throw new ApiError(statusCode, "Unauthorized", [], "");
    }

    try {
      const decoded = jwt.verify(accessToken, ENV.jwtSecret);

      if (typeof decoded === "string") {
        throw new ApiError(statusCode, "Unauthorized", [], "");
      }

      const user = await User.findById(decoded._id);
      if (!user) {
        throw new ApiError(statusCode, "Unauthorized", [], "");
      }

      req.user = user.toJSON();
      next();
    } catch (error) {
      throw new ApiError(statusCode, "Error verifying token", [], "");
    }
  }
)

const eventAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== "admin") {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized", [], "");
    } else {
      next();
    }
  }
)

export {
  userAuth,
  eventAuth
}