import { Router } from "express";
import { createBooking } from "../controllers/bookingController"
import { userAuth } from '../middlewares/authMiddleware';

const router = Router();

router.post("/purchase", userAuth, createBooking)

export default router;