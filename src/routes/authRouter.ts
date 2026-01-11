import { Router } from "express";
import { sendEmailOtp, verifyEmailOtp } from "../controllers/authController";
import { userAuth } from "../middlewares/authMiddleware"

const router = Router();

// email verification
router.post("/email/send-otp", userAuth, sendEmailOtp);
router.post("/email/verify-otp", userAuth, verifyEmailOtp);

export default router;