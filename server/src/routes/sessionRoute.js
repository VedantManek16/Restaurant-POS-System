import express from "express";
import { createSession, addSessionOrder, getSession, paySession } from "../controllers/sessionController.js";
import { isVerifiedUser } from "../middleware/tokenVerification.js";
import { verifyRole } from "../middleware/roleVerification.js";

const router = express.Router();

router.use(isVerifiedUser);

router.route("/").post(verifyRole(["Restaurant Admin", "Cashier", "Waiter"]), createSession);
router.route("/:id").get(verifyRole(["Restaurant Admin", "Cashier", "Waiter"]), getSession);
router.route("/:id/order").post(verifyRole(["Restaurant Admin", "Cashier", "Waiter"]), addSessionOrder);
router.route("/:id/pay").post(verifyRole(["Restaurant Admin", "Cashier"]), paySession);

export default router;
