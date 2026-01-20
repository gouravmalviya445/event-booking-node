import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/userModel";
import { ApiResponse } from "../utils/ApiResponse";
import { NextFunction, Request, Response } from "express";
import { userLoginSchema, userRegisterSchema } from "../schema/userValidation";
import { ApiError, StatusCodes } from "../utils/ApiError";
import { CookieOptions } from "express";
import { ENV } from "../env";
import z from "zod";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: ENV.nodeEnv === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000
}

const registerUser = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
  const { success, error, data } = userRegisterSchema.safeParse(req.body);
  if (!success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Invalid inputs",
      z.treeifyError(error).errors,
      error.stack
    );
  }

  // check if user already exists
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User already exists with this email", [], "");
  }

  const newUser = await User.create({
    email: data.email,
    password: data.password,
    name: data.name,
    role: data.role
  });

  if (!newUser?._id) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error registering user", [], "");
  }

  try {
    const accessToken = newUser.createAccessToken();
    const response = new ApiResponse(
      StatusCodes.CREATED,
      "User created successfully",
      {
        user: newUser.toJSON(),
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

const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { success, error, data } = userLoginSchema.safeParse(req.body);
    if (!success) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Invalid inputs",
        z.treeifyError(error).errors,
        error.stack
      );
    }

    const user = await User.findOne({ email: data.email });
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found", [], "");
    }

    const isPasswordCorrect = await user.comparePassword(data.password);
    if (!isPasswordCorrect) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid password", [], "");
    }

    try {
      const accessToken = user.createAccessToken();
      const response = new ApiResponse(
        StatusCodes.OK,
        "User logged in successfully",
        {
          user: user.toJSON(),
        }
      )
      res
        .status(response.statusCode)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(response)
    } catch (error: any) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error creating access token", [], error?.stack || "")
    }
  }
)

const logoutUser = asyncHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    res
      .status(StatusCodes.OK)
      .clearCookie("accessToken", cookieOptions)
      .json(new ApiResponse(
        StatusCodes.OK,
        "User logged out successfully",
        {}
      ));
  }
)

const getCurrentUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          "User fetched successfully",
          { user: req.user }
        )
      )
  }
)

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
}