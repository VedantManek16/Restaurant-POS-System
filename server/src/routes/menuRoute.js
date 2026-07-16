import express from "express";
import {
    getMenu,
    addCategory,
    editCategory,
    deleteCategory,
    addDish,
    editDish,
    deleteDish
} from "../controllers/menuController.js";
import { isVerifiedUser } from "../middleware/tokenVerification.js";

const router = express.Router();

const isAdmin = (req, res, next) => {
    if (req.user && (req.user.role === "Restaurant Admin" || req.user.role === "Super Admin")) {
        return next();
    }
    return res.status(403).json({ success: false, message: "Forbidden: Admins only." });
};

// Public read to verified user tenant
router.route("/").get(isVerifiedUser, getMenu);

// Category Admin management
router.route("/category").post(isVerifiedUser, isAdmin, addCategory);
router.route("/category/:id")
    .put(isVerifiedUser, isAdmin, editCategory)
    .delete(isVerifiedUser, isAdmin, deleteCategory);

// Dish Admin management
router.route("/category/:categoryId/dish").post(isVerifiedUser, isAdmin, addDish);
router.route("/category/:categoryId/dish/:dishId")
    .put(isVerifiedUser, isAdmin, editDish)
    .delete(isVerifiedUser, isAdmin, deleteDish);

export default router;
