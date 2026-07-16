import express from "express";
import { addTable, getTables, updateTable, deleteTable } from "../controllers/tableController.js";
import { isVerifiedUser } from "../middleware/tokenVerification.js";
import { verifyRole } from "../middleware/roleVerification.js";

const router = express.Router();

router.route("/").post(isVerifiedUser, verifyRole(["Restaurant Admin"]), addTable);
router.route("/").get(isVerifiedUser, verifyRole(["Restaurant Admin", "Waiter", "Cashier"]), getTables);
router.route("/:id")
    .put(isVerifiedUser, verifyRole(["Restaurant Admin", "Waiter", "Cashier"]), updateTable)
    .delete(isVerifiedUser, verifyRole(["Restaurant Admin"]), deleteTable);

export default router;
