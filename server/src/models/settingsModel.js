import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true,
        unique: true
    },
    restaurantName: {
        type: String,
        required: true,
        default: "Taste Hub Restaurant"
    },
    address: {
        type: String,
        default: "G-12, Food Circle Mall, Downtown City Centre, 400001"
    },
    email: {
        type: String,
        default: "contact@tastehub.com"
    },
    phone: {
        type: String,
        default: "+91 98765 43210"
    },
    currency: {
        type: String,
        default: "INR"
    },
    taxRate: {
        type: Number,
        default: 18 // percentage
    },
    serviceCharge: {
        type: Number,
        default: 5 // percentage
    },
    receiptFooter: {
        type: String,
        default: "Thank you for dining with us!"
    }
}, { timestamps: true });

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
