import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getAttendee,
  getOrganizer
} from "../controllers/userController";
import { organizerAuth, userAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", userAuth, logoutUser);

router.get("/current-user", userAuth, getCurrentUser);
router.get("/attendee", userAuth, getAttendee);
router.get("/organizer", userAuth, organizerAuth, getOrganizer);

export default router;