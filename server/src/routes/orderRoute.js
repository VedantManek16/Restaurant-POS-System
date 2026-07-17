import express from "express";
import { addOrder, getOrders, getOrderById, updateOrder } from "../controllers/orderController.js";
import { isVerifiedUser } from "../middleware/tokenVerification.js";
import { registerClient } from "../utils/notificationManager.js";

const router = express.Router();

router.route("/notifications/stream").get(registerClient);
router.route("/").post(isVerifiedUser, addOrder);
router.route("/").get(isVerifiedUser, getOrders);
router.route("/:id").get(isVerifiedUser, getOrderById);
router.route("/:id").put(isVerifiedUser, updateOrder);

export default router;
