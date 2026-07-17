import express from "express";
import { register, login, getUserData, logout, getTenantStaff, deleteStaff } from "../controllers/userController.js";
import { isVerifiedUser } from "../middleware/tokenVerification.js";
import { verifyRole } from "../middleware/roleVerification.js";

const router = express.Router();

// Authentication Routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(isVerifiedUser, logout);

router.route("/").get(isVerifiedUser, getUserData);
router.route("/staff").get(isVerifiedUser, verifyRole(["Super Admin", "Restaurant Admin"]), getTenantStaff);
router.route("/staff/:id").delete(isVerifiedUser, verifyRole(["Super Admin", "Restaurant Admin"]), deleteStaff);

export default router;