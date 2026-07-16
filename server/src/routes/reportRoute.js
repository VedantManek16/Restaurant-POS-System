import express from "express";
import { getAnalytics } from "../controllers/reportController.js";
import { isVerifiedUser } from "../middleware/tokenVerification.js";
import { verifyRole } from "../middleware/roleVerification.js";

const router = express.Router();

router.route("/analytics")
    .get(isVerifiedUser, verifyRole(["Restaurant Admin", "Cashier", "Waiter"]), getAnalytics);

export default router;
