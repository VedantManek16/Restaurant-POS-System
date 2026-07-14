import express from "express";
import { isVerifiedUser } from "../middleware/tokenVerification.js";
import { createOrder, verifyPayment, webHookVerification } from "../controllers/paymentController.js";

const router = express.Router();

router.route("/create-order").post(isVerifiedUser, createOrder);
router.route("/verify-payment").post(isVerifiedUser, verifyPayment);
router.route("/webhook-verification").post(webHookVerification);

export default router;
