import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import connectDB from "./config/db.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import userRoute from "./routes/userRoute.js";

connectDB();
const PORT = config.port || 8000;
const app = express();

// Middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Restaurant POS API is running" });
});

app.use("/api/user", userRoute);

// Global error handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log("\n🚀 RestroDesk API");
    console.log("──────────────────────────────");
    console.log(`Server:      http://localhost:${PORT}`);
    console.log("Database:    Connected");
    console.log("Environment: Development");
    console.log("Status:      Ready");
    console.log("──────────────────────────────\n");
});