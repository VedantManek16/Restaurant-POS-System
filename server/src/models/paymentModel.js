import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    paymentId: String,
    orderId: String,
    amount: Number,
    currency: String,
    status: String,
    method: String,
    email: String,
    contact: String,
    createdAt: Date
});

export default mongoose.model("Payment", paymentSchema);
