import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/userModel";
import { ApiResponse } from "../utils/ApiResponse";
import { NextFunction, Request, Response } from "express";
import { userLoginSchema, userRegisterSchema } from "../schema/userValidation";
import { ApiError, StatusCodes } from "../utils/ApiError";
import { CookieOptions } from "express";
import { ENV } from "../env";
import z from "zod";
import { apiClient } from "../utils/apiClient";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: ENV.nodeEnv === "production",
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: "none",
};

const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { success, error, data } = userRegisterSchema.safeParse(req.body);
    if (!success) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Invalid inputs",
        z.treeifyError(error).errors,
        error.stack,
      );
    }

    // check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "User already exists with this email",
        [],
        "",
      );
    }

    const newUser = await User.create({
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role,
    });

    if (!newUser?._id) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error registering user",
        [],
        "",
      );
    }

    try {
      const accessToken = newUser.createAccessToken();
      const response = new ApiResponse(
        StatusCodes.CREATED,
        "User created successfully",
        {
          user: newUser.toJSON(),
        },
      );
      res
        .status(response.statusCode)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(response);
    } catch (error: any) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error creating access token",
        [],
        error?.stack || "",
      );
    }
  },
);

const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { success, error, data } = userLoginSchema.safeParse(req.body);
    if (!success) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Invalid inputs",
        z.treeifyError(error).errors,
        error.stack,
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
        },
      );
      res
        .status(response.statusCode)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(response);
    } catch (error: any) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error creating access token",
        [],
        error?.stack || "",
      );
    }
  },
);

const logoutUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res
      .status(StatusCodes.OK)
      .clearCookie("accessToken", cookieOptions)
      .json(
        new ApiResponse(StatusCodes.OK, "User logged out successfully", {}),
      );
  },
);

const getCurrentUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, "User fetched successfully", {
        user: req.user,
      }),
    );
  },
);

const getAttendee = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // call golang service to get booking data for the user
    try {
      const {
        data: { data },
      } = await apiClient.get(`/api/bookings/user/${req.user._id}`);

      const details = {
        totalBookings: data?.totalBookings,
        totalSpent: data?.totalSpent / 100, // normalize payment
        upcomingEvents: data?.upcomingEvents,
        bookings: data?.bookings,
      };

      res
        .status(StatusCodes.OK)
        .json(
          new ApiResponse(
            StatusCodes.OK,
            "attendee dashboard data fetched successfully",
            details,
          ),
        );
    } catch (error: any) {
      throw new ApiError(
        error?.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
        error?.response?.data?.error ||
          "Error fetching attendee dashboard data",
        [],
        "",
      );
    }
  },
);

const getOrganizer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        data: { data },
      } = await apiClient.get(`/api/events?organizerId=${req.user._id}`);

      res
        .status(StatusCodes.OK)
        .json(
          new ApiResponse(
            StatusCodes.OK,
            "Organizer dashboard data fetched successfully",
            data,
          ),
        );
    } catch (error: any) {
      throw new ApiError(
        error?.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
        error?.response?.data?.error ||
          "Error fetching organizer dashboard data",
        [],
        "",
      );
    }
  },
);

// admin
const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.find({
        _id: { $ne: req.user._id },
      });

      res.status(StatusCodes.OK).json(
        new ApiResponse(StatusCodes.OK, "Users fetched successfully", {
          users,
          totalUsers: users?.length || 0,
          totalVerifiedUsers: users.reduce(
            (total, user) => total + (user.isEmailVerified ? 1 : 0),
            0,
          ),
          totalAdmins: users.reduce(
            (total, user) => total + (user.role === "admin" ? 1 : 0),
            0,
          ),
          totalOrganizers: users.reduce(
            (total, user) => total + (user.role === "organizer" ? 1 : 0),
            0,
          ),
        }),
      );
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error fetching users",
        [],
        "",
      );
    }
  },
);

const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id || !id.trim()) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "User id is required",
        [],
        "",
      );
    }

    try {
      await User.findByIdAndDelete(id);
      res
        .status(StatusCodes.OK)
        .json(new ApiResponse(StatusCodes.OK, "User deleted successfully", {}));
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error deleting user",
        [],
        "",
      );
    }
  },
);

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getAttendee,
  getOrganizer,
  getAllUsers,
  deleteUser,
};
