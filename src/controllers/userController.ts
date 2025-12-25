import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/userModel";
import { ApiResponse } from "../utils/ApiResponse";
import { NextFunction, Request, Response } from "express";
import { userRegisterSchema } from "../schema/userValidation";
import { ApiError, StatusCodes } from "../utils/ApiError";

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
      .status(StatusCodes.CREATED)
      .json(response)
  } catch (error: any) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error creating access token", [], error?.stack || "")
  }
})


export {
  registerUser
}