import { Router } from "express";
import { userAuth } from '../middlewares/authMiddleware';
import { checkBookingStatus } from "../controllers/bookingController";

const router = Router();
router.get("/", userAuth, checkBookingStatus);


export default router;