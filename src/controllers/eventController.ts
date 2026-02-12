import { Request, Response, NextFunction } from "express";
import { ApiError, StatusCodes } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { eventCreateSchema } from "../schema/eventValidation";
import z from "zod";
import { Event } from "../models/eventModel";
import { seedDummyEvents } from "../db/seed";

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
      image: data.image,
      totalSeats: data.totalSeats,
      availableSeats: data.totalSeats,
      category: data.category,
      organizer: req.user._id,
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
    const queryParam = String(req.query.search);

    const [search, order, category] = queryParam.split("|");

    const query: Record<string, any> = {}
    const sortOptions: Record<string, any> = {
      "date-asc": { date: 1 },
      "date-desc": { date: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
    };

    if (search.trim() !== "") {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ]
    }
    
    if (category.trim() !== "") {
      query.category = category;
    }

    // 2. Select the sort order (default to 'date-asc' if 'order' is invalid or missing)
    const sortBy = sortOptions[order] || { date: 1 };
    
    try {
      const events = await Event.find(query)
        .sort(sortBy)
        .populate("organizer", "name");
      res
        .status(StatusCodes.OK)
        .json(
          new ApiResponse(
            StatusCodes.OK,
            "Events fetched successfully",
            { events }
          )
        )
    } catch (error) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error fetching events", [], "");
    }

  }
)

const getEventById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Event id is required", [], "");
    }

    const event = await Event.findById(id).populate("organizer", "name");
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

const demoEvent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user._id
      await seedDummyEvents(String(userId));
      
      res
        .status(StatusCodes.OK)
        .json(
          new ApiResponse(
            StatusCodes.OK,
            "Dummy events seeded successfully",
            {}
          )
        )
    } catch (error) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error seeding dummy events", [], "");
    }
  }
)


export {
  createEvent,
  listEvent,
  getEventById,
  demoEvent
}