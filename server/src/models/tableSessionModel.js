import mongoose from "mongoose";

const tableSessionSchema = new mongoose.Schema({
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
    restaurantId: { type: String, required: true },
    customerDetails: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        guests: { type: Number, required: true }
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }], // Links to individual kitchen orders in this session
    status: { type: String, default: "Active" }, // "Active", "Paid"
    startTime: { type: Date, default: Date.now },
    bills: {
        subtotal: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
    },
    paymentMethod: String,
    paymentData: mongoose.Schema.Types.Mixed
}, { timestamps: true });

export default mongoose.model("TableSession", tableSessionSchema);
