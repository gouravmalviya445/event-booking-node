import { Request, Response, NextFunction } from "express";
import { ApiError, StatusCodes } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { apiClient } from "../utils/apiClient";
import { mailSender } from "../utils/mailer";

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

const sendConfirmationEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.isEmailVerified === false) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Please verify you email first", [], "");
    }

    const orderId = String(req.body.OrderId);
    if (!orderId.trim()) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Order id is required", [], "");
    }

    try {
      const info = await mailSender(req.user.email, "Booking Confirmation", "Your booking has been confirmed", `<p>Your booking has been confirmed successfully order id: ${orderId}</p>`);

      if (info.messageId) {
        res
          .status(StatusCodes.OK)
          .json(new ApiResponse(StatusCodes.OK, "Email sent successfully", {}))
      }
    } catch (error) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error sending email", [], "");     
    }    
  }
)

export {
  checkBookingStatus,
  getAllBookings,
  sendConfirmationEmail
}