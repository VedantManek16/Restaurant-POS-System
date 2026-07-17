import mongoose from "mongoose";
import Settings from "./models/settingsModel.js";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/restaurant-pos")
    .then(async () => {
        const configs = await Settings.find({});
        console.log("----------------------------------------");
        console.log(`FOUND ${configs.length} SETTINGS RECORDS IN DB:`);
        configs.forEach((config, idx) => {
            console.log(`Record #${idx + 1}:`);
            console.log("  Tenant ID:      ", config.tenantId);
            console.log("  Restaurant Name:", config.restaurantName);
            console.log("  Logo URL:       ", config.logoUrl ? (config.logoUrl.startsWith("http") ? "✅ CLOUDINARY: " + config.logoUrl : "⚠️ BASE64: " + config.logoUrl.substring(0, 50) + "...") : "None");
            console.log("  UPI QR URL:     ", config.upiQrUrl ? (config.upiQrUrl.startsWith("http") ? "✅ CLOUDINARY: " + config.upiQrUrl : "⚠️ BASE64: " + config.upiQrUrl.substring(0, 50) + "...") : "None");
        });
        console.log("----------------------------------------");
        process.exit(0);
    }).catch(err => {
        console.error("DB Connect Error:", err);
        process.exit(1);
    });
