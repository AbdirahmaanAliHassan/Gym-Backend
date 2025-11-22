import { Router } from "express";
import auth from "../middleware/auth";
import { permit } from "../middleware/roles";

import {
  getAllMembers,
  createMember,
  getMemberById,
  updateMember
} from "../controllers/memberController";

const router = Router();

router.get("/", auth, permit("ADMIN", "STAFF"), getAllMembers);
router.post("/", auth, permit("ADMIN", "STAFF"), createMember);
router.get("/:id", auth, getMemberById);
router.put("/:id", auth, permit("ADMIN", "STAFF"), updateMember);

export default router;
