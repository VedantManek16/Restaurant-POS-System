import express from "express"
import gloabalErrorHandler from "./middleware/globalErrorHandler.js"
import createHttpError from "http-errors";

const app = express();

app.use(express.json());

app.get("/",(req,res) => {
    // const err = createHttpError(404,"something went wrong!")
    // throw err;

    res.json({message:"Restaurant POS API is running"})
});

// Test Error Route
app.get("/error", (req, res, next) => {

    // Creates error object
    const error = createHttpError(401, "Unauthorized Access");

    next(error);
});


// 404 Route Handler
app.use((req, res, next) => {
    next(createHttpError(404, "Route Not Found"));
});

//Golbal error handler
app.use(gloabalErrorHandler)

export default app;