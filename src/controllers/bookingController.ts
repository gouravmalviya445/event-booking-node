import { Request, Response, NextFunction } from "express";
import { ApiError, StatusCodes } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import z from "zod";
import { bookingCreateSchema } from "../schema/bookingValidation";

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

    // call go lang server
  }
)