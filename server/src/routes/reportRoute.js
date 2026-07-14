import express from "express";
import { getAnalytics } from "../controllers/reportController.js";
import { isVerifiedUser } from "../middleware/tokenVerification.js";

const router = express.Router();

router.route("/analytics")
    .get(isVerifiedUser, getAnalytics);

export default router;
