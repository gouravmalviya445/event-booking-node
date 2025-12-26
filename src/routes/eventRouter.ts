import { Router } from "express";
import { eventAuth, userAuth } from "../middlewares/authMiddleware";
import { createEvent } from "../controllers/eventController";

const router = Router();


// private routes
router.post("/create", userAuth, eventAuth, createEvent);

// TODO: add some more routes later
// event delete/update
// event list route -> "my-events" (event created by organizer)



export default router;