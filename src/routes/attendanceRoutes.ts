import { Router } from "express";
import auth from "../middleware/auth";
import { permit } from "../middleware/roles";

import {
  checkIn,
  checkOut,
  getAttendance,
} from "../controllers/attendanceController";

const router = Router();

router.post("/check-in", auth, permit("ADMIN", "STAFF"), checkIn);
router.post("/check-out", auth, permit("ADMIN", "STAFF"), checkOut);
router.get("/", auth, permit("ADMIN", "STAFF"), getAttendance);

export default router;
