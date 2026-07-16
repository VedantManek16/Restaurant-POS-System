import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { isVerifiedUser } from "../middleware/tokenVerification.js";
import { verifyRole } from "../middleware/roleVerification.js";

const router = express.Router();

router.route("/")
    .get(isVerifiedUser, verifyRole(["Restaurant Admin", "Cashier", "Waiter"]), getSettings)
    .put(isVerifiedUser, verifyRole(["Restaurant Admin"]), updateSettings);

export default router;
