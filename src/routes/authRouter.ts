import { Router } from "express";
import { sendEmailOtp, verifyEmailOtp, sendResetPasswordOtp, verifyResetPasswordOtp, resetPassword } from "../controllers/authController";
import { userAuth } from "../middlewares/authMiddleware"

const router = Router();

// email verification
router.post("/email/send-otp", userAuth, sendEmailOtp);
router.post("/email/verify-otp", userAuth, verifyEmailOtp);

// reset password
router.post("/password/send-otp", sendResetPasswordOtp);
router.post("/password/verify-otp", verifyResetPasswordOtp)
router.post("/password/reset", resetPassword)


export default router;