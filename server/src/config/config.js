import dotenv from "dotenv";
dotenv.config();

const config = Object.freeze({
    port: process.env.PORT || 3000,
    databaseURI: process.env.MONGO_URI || "mongodb://localhost:27017/restaurant-pos",
    nodeEnv: process.env.NODE_ENV || "development"
});

export default config;