import config from "./config/config.js";
import app from "./app.js";
import connectDB from "./config/db.js";

connectDB();

const PORT = config.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});