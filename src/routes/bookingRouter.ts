import { Router } from "express";
import { adminAuth, userAuth } from '../middlewares/authMiddleware';
import { checkBookingStatus, getAllBookings } from "../controllers/bookingController";

const router = Router();
router.get("/:orderId", userAuth, checkBookingStatus);
router.get("/", userAuth, adminAuth, getAllBookings);


export default router;