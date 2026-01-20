import Router from "express";
import { createPaymentOrder, verifyPaymentOrder } from "../controllers/paymentController";
import { paymentAuth, userAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post("/order", userAuth, paymentAuth, createPaymentOrder);
router.post("/verify", userAuth, paymentAuth, verifyPaymentOrder);


export default router;