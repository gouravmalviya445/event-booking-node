import { Request, Response, NextFunction } from "express";
import { ApiError, StatusCodes } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { eventCreateSchema } from "../schema/eventValidation";
import z from "zod";
import { Event } from "../models/eventModel";

const createEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { success, error, data } = eventCreateSchema.safeParse(req.body);
    if (!success) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Invalid inputs",
        z.treeifyError(error).errors,
        error.stack
      )
    }

    const event = await Event.create({
      title: data.title,
      description: data.description,
      location: data.location,
      date: data.date,
      price: data.price,
      totalSeats: data.totalSeats,
      availableSeats: data.availableSeats,
      status: data.status
    })

    res
      .status(StatusCodes.CREATED)
      .json(
        new ApiResponse(
          StatusCodes.CREATED,
          "Event created successfully",
          { event }
        )
      )
    
  }
)

const listEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const events = await Event.find({ status: "active" });
    if (events.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No events found", [], "");
    }

    res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          "Events fetched successfully",
          { events }
        )
      )
  }
)

const getEventById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Event id is required", [], "");
    }

    const event = await Event.findById(id);
    if (!event) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Event not found", [], "");
    }

    res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          "Event fetched successfully",
          { event }
        )
      )

  }
)


export {
  createEvent,
  listEvent,
  getEventById,
}