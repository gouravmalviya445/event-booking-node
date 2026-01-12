import { Router } from "express";
import { sendEmailOtp, verifyEmailOtp, sendResetPasswordOtp, verifyResetPasswordOtp, resetPassword } from "../controllers/authController";
import { userAuth } from "../middlewares/authMiddleware"

const router = Router();

// email verification
router.post("/email/send", userAuth, sendEmailOtp);
router.post("/email/verify", userAuth, verifyEmailOtp);

// reset password
router.post("/password/send", sendResetPasswordOtp);
router.post("/password/verify", verifyResetPasswordOtp)
router.post("/password/reset", resetPassword)


export default router;