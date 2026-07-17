import config from "../config/config.js";

const globalErrorHandler = (err,req,res,next) => {
    const statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong!";

    // Handle nested error descriptions from third-party services like Razorpay
    if (err.error && typeof err.error === "object" && err.error.description) {
        message = err.error.description;
    }

    return res.status(statusCode).json({
        success: false,
        status: statusCode,
        message,
        errorStack: config.nodeEnv === "development" ? err.stack : null
    });
    
};
export default globalErrorHandler;