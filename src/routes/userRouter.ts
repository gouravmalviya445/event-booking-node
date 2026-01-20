import { Router } from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser } from "../controllers/userController";
import { userAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", userAuth, logoutUser);

router.get("/current-user", userAuth, getCurrentUser);

export default router;