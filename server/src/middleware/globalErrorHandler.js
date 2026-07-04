import config from "../config/config.js";

const globalErrorHandler = (err,req,res,next) => {
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: err.message,
        errorStack: config.nodeEnv === "development" ? err.stack : null
    });
    
};
export default globalErrorHandler;