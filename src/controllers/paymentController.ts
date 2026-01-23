import { Request, Response, NextFunction } from "express";
import { ApiError, StatusCodes } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { createPaymentOrderSchema, verifyPaymentSchema } from "../schema/paymentValidation";
import { treeifyError } from "zod/v4/core";
import { apiClient } from "../utils/apiClient";
import { ENV } from "../env";

const createPaymentOrder = asyncHandler(
  async (req: Request, res: Response, _: NextFunction) => {
    const { success, data, error } = createPaymentOrderSchema.safeParse(req.body);
    if (!success) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        treeifyError(error).errors[0],
        treeifyError(error).errors,
        error.stack
      )
    }

    try {
      // call go lang server to create order
      const { data : { data: order } } = await apiClient.post("/api/bookings/order", {
        eventId: data.eventId,
        userId: req.user._id,
        amount: data.amount * 100, // in INR subunit
        currency: data.currency,
        totalTickets: data.totalTickets
      })

      res.status(StatusCodes.OK).json(
        new ApiResponse(
          StatusCodes.OK,
          "Payment Order created successfully",
          order,
        )
      )
    } catch (error: any) {
      console.log(error)
      throw new ApiError(
        error?.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
        error?.response?.data?.error || "Error creating order",
        [],
        error.stack
      )
    }
  }
)

const verifyPaymentOrder = asyncHandler(
  async (req: Request, res: Response, _: NextFunction) => {
    const { success, data, error } = verifyPaymentSchema.safeParse(req.body);
    if (!success) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        treeifyError(error).errors[0],
        treeifyError(error).errors,
        error.stack
      )
    }

    try {
      // call go lang server to verify payment
      const { data: { data: order} } = await apiClient.post("/api/bookings/verify", data);
      
      res
        .status(StatusCodes.OK)
        .redirect(`${ENV.clientUrl}/payment?orderId=${order.orderId}`)
    } catch (error: any) {
      res
        .redirect(`${ENV.clientUrl}/payment?orderId=${data.razorpay_order_id}`)
    }
  }
)

export {
  createPaymentOrder,
  verifyPaymentOrder
}