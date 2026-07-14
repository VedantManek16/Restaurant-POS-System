import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { isVerifiedUser } from "../middleware/tokenVerification.js";

const router = express.Router();

router.route("/")
    .get(isVerifiedUser, getSettings)
    .put(isVerifiedUser, updateSettings);

export default router;
