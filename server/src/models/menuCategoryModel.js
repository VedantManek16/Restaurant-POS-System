import mongoose from "mongoose";

const dishSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    isVeg: { type: Boolean, default: true },
    image: { type: String, default: "" } // Base64 string or image URL
});

const menuCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    bgColor: { type: String, default: "#f6b100" },
    icon: { type: String, default: "🍲" },
    restaurantId: { type: String, required: true }, // tenantId
    items: [dishSchema]
}, { timestamps: true });

export default mongoose.model("MenuCategory", menuCategorySchema);
