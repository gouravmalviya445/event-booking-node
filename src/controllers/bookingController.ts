import { Request, Response, NextFunction } from "express";
import { ApiError, StatusCodes } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { apiClient } from "../utils/apiClient";

const checkBookingStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.OrderId;

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

const getAllBookings = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data: { data } } = await apiClient.get(`/api/bookings`);

      res
        .status(StatusCodes.OK)
        .json(
          new ApiResponse(
            StatusCodes.OK,
            "Bookings fetched successfully",
            data
          )
        )
    } catch (error: any) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        error?.response?.data?.error || "Error fetching bookings",
        [],
        ""
      );
    }
  }
)

export {
  checkBookingStatus,
  getAllBookings
}