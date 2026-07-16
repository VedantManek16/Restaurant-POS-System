import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import connectDB from "./config/db.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import userRoute from "./routes/userRoute.js";
import tableRoute from "./routes/tableRoute.js";
import orderRoute from "./routes/orderRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import settingsRoute from "./routes/settingsRoute.js";
import reportRoute from "./routes/reportRoute.js";
import sessionRoute from "./routes/sessionRoute.js";
import menuRoute from "./routes/menuRoute.js";

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
app.use("/api/table", tableRoute);
app.use("/api/order", orderRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/settings", settingsRoute);
app.use("/api/reports", reportRoute);
app.use("/api/session", sessionRoute);
app.use("/api/menu", menuRoute);

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