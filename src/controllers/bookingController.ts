import { Request, Response, NextFunction } from "express";
import { ApiError, StatusCodes } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import z from "zod";
import { bookingCreateSchema } from "../schema/bookingValidation";
import { ENV } from "../env";
import mongoose from "mongoose";
import { apiClient } from "../utils/apiClient";

const checkBookingStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = String(req.query.orderId);

    if (!orderId.trim()) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Order id is required", [], "");
    }

    try {
      const { data: { data: booking } } = await apiClient.get(`/api/bookings/${orderId}`);

      res
        .status(StatusCodes.OK)
        .json(
          new ApiResponse(
            StatusCodes.OK,
            "Booking status fetched successfully",
            booking
          )
        )
      
    } catch (error: any) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        error?.response?.data?.error || "Error checking booking status",
        [],
        ""
      );
    }
        
  }
)

export {
  checkBookingStatus
}