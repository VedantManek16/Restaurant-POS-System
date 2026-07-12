import createHttpError from "http-errors";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const register = async (req, res, next) => {
    try {
        const { name, phone, email, password, role, tenantName } = req.body;

        if (!name || !phone || !email || !password || !role) {
            const error = createHttpError(400, "All fields are required!");
            return next(error);
        }

        let finalTenantName = tenantName;
        let finalTenantId = "";

        if (role === "Super Admin") {
            finalTenantName = "RestroDesk";
            finalTenantId = "restrodesk";
        } else {
            if (!finalTenantName) {
                const error = createHttpError(400, "Restaurant Name is required!");
                return next(error);
            }
            finalTenantId = finalTenantName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
        }

        const isUserPresent = await User.findOne({ email });
        if (isUserPresent) {
            const error = createHttpError(400, "User already exists!");
            return next(error);
        }

        const newUser = new User({ 
            name, 
            phone, 
            email, 
            password, 
            role, 
            tenantId: finalTenantId, 
            tenantName: finalTenantName 
        });
        await newUser.save();

        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({ success: true, message: "New user created!", data: userResponse });

    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = createHttpError(400, "All fields are required!");
            return next(error);
        }

        const isUserPresent = await User.findOne({ email });
        if (!isUserPresent) {
            const error = createHttpError(401, "Invalid Credentials");
            return next(error);
        }

        const isMatch = await bcrypt.compare(password, isUserPresent.password);
        if (!isMatch) {
            const error = createHttpError(401, "Invalid Credentials");
            return next(error);
        }

        const accessToken = jwt.sign({ _id: isUserPresent._id }, config.accessTokenSecret, {
            expiresIn: '1d'
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: config.nodeEnv === 'development' ? 'lax' : 'none',
            secure: config.nodeEnv !== 'development'
        });

        const userResponse = isUserPresent.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: "User logged in successfully!",
            data: userResponse
        });

    } catch (error) {
        next(error);
    }
};

export const getUserData = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            const error = createHttpError(404, "User not found!");
            return next(error);
        }
        res.status(200).json({ success: true, data: user });

    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        res.clearCookie('accessToken', {
            httpOnly: true,
            sameSite: config.nodeEnv === 'development' ? 'lax' : 'none',
            secure: config.nodeEnv !== 'development'
        });
        res.status(200).json({ success: true, message: "User logged out successfully!" });

    } catch (error) {
        next(error);
    }
};