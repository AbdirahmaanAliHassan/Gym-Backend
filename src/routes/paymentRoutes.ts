import { Router } from "express";
import auth from "../middleware/auth";
import { permit } from "../middleware/roles";

import {
  createPayment,
  getPayments
} from "../controllers/paymentsController";

const router = Router();

router.post("/", auth, permit("ADMIN", "STAFF"), createPayment);
router.get("/", auth, permit("ADMIN", "STAFF"), getPayments);

export default router;
