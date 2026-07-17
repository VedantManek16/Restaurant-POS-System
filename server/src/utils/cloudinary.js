import { v2 as cloudinary } from "cloudinary";
import config from "../config/config.js";

export const uploadToCloudinary = async (base64Str, folder = "restaurant-pos") => {
    if (!base64Str) return "";
    // If it's already a URL, return it
    if (base64Str.startsWith("http")) return base64Str;
    
    // Check if Cloudinary credentials are set and not placeholder defaults
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || config.cloudinaryCloudName;
    const apiKey = process.env.CLOUDINARY_API_KEY || config.cloudinaryApiKey;
    const apiSecret = process.env.CLOUDINARY_API_SECRET || config.cloudinaryApiSecret;

    if (!cloudName || !apiKey || !apiSecret || cloudName === "your_cloud_name") {
        console.warn("⚠️ Cloudinary credentials not configured. Falling back to local Base64 storage.");
        return base64Str;
    }

    // Initialize/configure Cloudinary dynamically on every call
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret
    });

    try {
        const uploadResponse = await cloudinary.uploader.upload(base64Str, {
            folder: folder
        });
        return uploadResponse.secure_url;
    } catch (error) {
        console.error("⚠️ Cloudinary upload failed:", error.message || error);
        console.warn("Falling back to local Base64 storage.");
        return base64Str;
    }
};
