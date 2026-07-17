import express from "express";
import { getAnalytics, getReportData } from "../controllers/reportController.js";
import { isVerifiedUser } from "../middleware/tokenVerification.js";
import { verifyRole } from "../middleware/roleVerification.js";

const router = express.Router();

router.route("/analytics")
    .get(isVerifiedUser, verifyRole(["Restaurant Admin", "Cashier", "Waiter"]), getAnalytics);

router.route("/data/:reportType")
    .get(isVerifiedUser, verifyRole(["Restaurant Admin"]), getReportData);

export default router;
