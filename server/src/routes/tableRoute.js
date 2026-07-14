import express from "express";
import { addTable, getTables, updateTable } from "../controllers/tableController.js";
import { isVerifiedUser } from "../middleware/tokenVerification.js";

const router = express.Router();

router.route("/").post(isVerifiedUser, addTable);
router.route("/").get(isVerifiedUser, getTables);
router.route("/:id").put(isVerifiedUser, updateTable);

export default router;
