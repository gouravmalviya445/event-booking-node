import { Router } from "express";
import { adminAuth, organizerAuth, userAuth } from "../middlewares/authMiddleware";
import { createEvent, getEventById, listEvent, demoEvent } from "../controllers/eventController";

const router = Router();

// public routes
router.get("/:id", getEventById);
router.get("/", listEvent);

// private routes
router.post("/create", userAuth, organizerAuth, createEvent);

// fill dummy events this route is only accessible by admin
router.post("/dummy", userAuth, adminAuth, demoEvent); 

// TODO: add some more routes later
// event delete/update
// event list route -> "my-events" (event created by organizer)



export default router;