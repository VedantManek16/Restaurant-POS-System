import dotenv from "dotenv";
dotenv.config();

const config = Object.freeze({
    port: process.env.PORT || 3000,
    databaseURI: process.env.MONGO_URI || "mongodb://localhost:27017/restaurant-pos",
    nodeEnv: process.env.NODE_ENV || "development",
    accessTokenSecret: process.env.JWT_SECRET || "default_jwt_secret",
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    razorpaySecretKey: process.env.RAZORPAY_KEY_SECRET,
    razorpyWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET
});

export default config;