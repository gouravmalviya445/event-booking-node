import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/userController";
import { userAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", userAuth, logoutUser);

export default router;