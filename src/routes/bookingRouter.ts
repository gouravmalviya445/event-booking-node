import { Router } from "express";
import { adminAuth, userAuth } from '../middlewares/authMiddleware';
import { checkBookingStatus, getAllBookings, sendConfirmationEmail } from "../controllers/bookingController";

const router = Router();

router.get("/:orderId", userAuth, checkBookingStatus);
router.post("/send-email", userAuth, sendConfirmationEmail)

// admin
router.get("/", userAuth, adminAuth, getAllBookings);


export default router;