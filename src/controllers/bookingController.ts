import { Request, Response, NextFunction } from "express";
import { ApiError, StatusCodes } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import z from "zod";
import { bookingCreateSchema } from "../schema/bookingValidation";
import { ENV } from "../env";
import mongoose from "mongoose";

// book an event
const createBooking = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // call go lang server with event_id and user_id to book the event
    const { success, error, data } = bookingCreateSchema.safeParse(req.body);
    if (!success) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Invalid inputs",
        z.treeifyError(error).errors,
        error.stack
      )
    }
    
    const response = await fetch(`${ENV.golangServerUrl}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "eventId": data.eventId,
        "userId": req.user._id
      })
    })

    // parse the json response
    const parseJson = await response.json();

    if (parseJson.status === "ERROR") {
      throw new ApiError(response.status, parseJson.error, [], "");
    }

    res
      .status(StatusCodes.CREATED)
      .json(
        new ApiResponse(
          StatusCodes.CREATED,
          "Event booked successfully",
          { booking: parseJson.data as Record<string, any> }
        )
      )
  }
)

export {
  createBooking
}