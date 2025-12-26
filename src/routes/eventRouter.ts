import { Router } from "express";
import { eventAuth, userAuth } from "../middlewares/authMiddleware";
import { createEvent, getEventById, listEvent } from "../controllers/eventController";

const router = Router();

// public routes
router.get("/:id", getEventById);
router.post("/", listEvent);

// private routes
router.post("/create", userAuth, eventAuth, createEvent);

// TODO: add some more routes later
// event delete/update
// event list route -> "my-events" (event created by organizer)



export default router;