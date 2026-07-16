import createHttpError from "http-errors";

export const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                const error = createHttpError(401, "User not authenticated!");
                return next(error);
            }

            if (!allowedRoles.includes(req.user.role)) {
                const error = createHttpError(403, "Access denied! Insufficient permissions.");
                return next(error);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
