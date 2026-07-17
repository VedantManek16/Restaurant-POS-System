import MenuCategory from "../models/menuCategoryModel.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

// @desc    Get all menu categories and items for the restaurant
// @route   GET /api/menu
// @access  Private (All authenticated roles of the tenant)
export const getMenu = async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        const categories = await MenuCategory.find({ restaurantId: tenantId });
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add a new category
// @route   POST /api/menu/category
// @access  Private (Restaurant Admin)
export const addCategory = async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        const { name, bgColor, icon } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: "Category name is required." });
        }

        const newCategory = new MenuCategory({
            name,
            bgColor: bgColor || "#f6b100",
            icon: icon || "🍲",
            restaurantId: tenantId,
            items: []
        });

        await newCategory.save();
        res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Edit a category
// @route   PUT /api/menu/category/:id
// @access  Private (Restaurant Admin)
export const editCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, bgColor, icon } = req.body;

        const category = await MenuCategory.findOne({ _id: id, restaurantId: req.user.tenantId });
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }

        if (name) category.name = name;
        if (bgColor) category.bgColor = bgColor;
        if (icon) category.icon = icon;

        await category.save();
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a category
// @route   DELETE /api/menu/category/:id
// @access  Private (Restaurant Admin)
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await MenuCategory.findOneAndDelete({ _id: id, restaurantId: req.user.tenantId });
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }

        res.status(200).json({ success: true, message: "Category deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add a dish to a category
// @route   POST /api/menu/category/:categoryId/dish
// @access  Private (Restaurant Admin)
export const addDish = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name, price, description, isVeg, image } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({ success: false, message: "Name and Price are required." });
        }

        const category = await MenuCategory.findOne({ _id: categoryId, restaurantId: req.user.tenantId });
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }

        let uploadedImageUrl = "";
        if (image && image.startsWith("data:image")) {
            uploadedImageUrl = await uploadToCloudinary(image, "dishes");
        } else {
            uploadedImageUrl = image || "";
        }

        category.items.push({
            name,
            price: Number(price),
            description: description || "",
            isVeg: isVeg !== undefined ? isVeg : true,
            image: uploadedImageUrl
        });

        await category.save();
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Edit a dish inside a category
// @route   PUT /api/menu/category/:categoryId/dish/:dishId
// @access  Private (Restaurant Admin)
export const editDish = async (req, res) => {
    try {
        const { categoryId, dishId } = req.params;
        const { name, price, description, isVeg, image } = req.body;

        const category = await MenuCategory.findOne({ _id: categoryId, restaurantId: req.user.tenantId });
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }

        const dish = category.items.id(dishId);
        if (!dish) {
            return res.status(404).json({ success: false, message: "Dish not found." });
        }

        if (name) dish.name = name;
        if (price !== undefined) dish.price = Number(price);
        if (description !== undefined) dish.description = description;
        if (isVeg !== undefined) dish.isVeg = isVeg;
        
        if (image !== undefined) {
            if (image && image.startsWith("data:image")) {
                dish.image = await uploadToCloudinary(image, "dishes");
            } else {
                dish.image = image;
            }
        }

        await category.save();
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a dish from a category
// @route   DELETE /api/menu/category/:categoryId/dish/:dishId
// @access  Private (Restaurant Admin)
export const deleteDish = async (req, res) => {
    try {
        const { categoryId, dishId } = req.params;

        const category = await MenuCategory.findOne({ _id: categoryId, restaurantId: req.user.tenantId });
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }

        const dish = category.items.id(dishId);
        if (!dish) {
            return res.status(404).json({ success: false, message: "Dish not found." });
        }

        category.items.pull(dishId);
        await category.save();

        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
