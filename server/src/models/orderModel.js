import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    tableId: {
        type: String,
        required: false
    },
    items: [{
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        default: "pending"
    }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);