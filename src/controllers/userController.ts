import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/userModel";
import { ApiResponse } from "../utils/ApiResponse";
import { NextFunction, Request, Response } from "express";
import { userRegisterSchema } from "../schema/userValidation";
import { ApiError, StatusCodes } from "../utils/ApiError";
import { CookieOptions } from "express";
import { ENV } from "../env";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: ENV.nodeEnv === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000
}

const registerUser = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
  const { success, error, data } = userRegisterSchema.safeParse(req.body);
  if (!success) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid inputs", [error.message], error.stack);
  }

  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User already exists", [], "");
  }

  const newUser = await User.create({
    email: data.email,
    password: data.password,
    name: data.name,
    role: data.role
  });

  if (!newUser?._id) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error creating user", [], "");
  }

  try {
    const accessToken = newUser.createAccessToken();
    const response = new ApiResponse(
      StatusCodes.CREATED,
      "User created successfully",
      {
        user: newUser.toJSON(),
        accessToken
      }
    )
    res
      .status(response.statusCode)
      .cookie("accessToken", accessToken, cookieOptions)
      .json(response)
  } catch (error: any) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error creating access token", [], error?.stack || "")
  }
})


export {
  registerUser
}