import express from "express"
import config from "./config/config.js";
import connectDB from "./config/db.js";
import gloabalErrorHandler from "./middleware/globalErrorHandler.js"

connectDB();
const PORT = config.PORT || 8000;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Restaurant POS API is running" })
});

//Golbal error handler
app.use(gloabalErrorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});