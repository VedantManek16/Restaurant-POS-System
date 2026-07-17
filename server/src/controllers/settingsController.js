import Settings from "../models/settingsModel.js";
import createHttpError from "http-errors";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const getSettings = async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;
        let config = await Settings.findOne({ tenantId });
        
        if (!config) {
            // Initialize default settings for this tenant
            config = await Settings.create({
                tenantId,
                restaurantName: req.user.tenantName || "Taste Hub Restaurant",
                email: req.user.email || "contact@tastehub.com"
            });
        }

        res.status(200).json({
            success: true,
            data: config
        });
    } catch (error) {
        next(error);
    }
};

export const updateSettings = async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;
        const {
            restaurantName,
            address,
            email,
            phone,
            currency,
            taxRate,
            receiptFooter,
            logoUrl,
            upiId,
            upiName,
            upiQrUrl,
            gstNo
        } = req.body;

        let config = await Settings.findOne({ tenantId });
        if (!config) {
            config = new Settings({ tenantId });
        }

        if (restaurantName !== undefined) config.restaurantName = restaurantName;
        if (address !== undefined) config.address = address;
        if (email !== undefined) config.email = email;
        if (phone !== undefined) config.phone = phone;
        if (currency !== undefined) config.currency = currency;
        if (taxRate !== undefined) config.taxRate = Number(taxRate);
        
        // Force service charge to 0 as requested by the user
        config.serviceCharge = 0;
        
        if (receiptFooter !== undefined) config.receiptFooter = receiptFooter;
        if (upiId !== undefined) config.upiId = upiId;
        if (upiName !== undefined) config.upiName = upiName;
        if (gstNo !== undefined) config.gstNo = gstNo;

        if (logoUrl !== undefined) {
            if (logoUrl && logoUrl.startsWith("data:image")) {
                config.logoUrl = await uploadToCloudinary(logoUrl, "settings");
            } else {
                config.logoUrl = logoUrl;
            }
        }

        if (upiQrUrl !== undefined) {
            if (upiQrUrl && upiQrUrl.startsWith("data:image")) {
                config.upiQrUrl = await uploadToCloudinary(upiQrUrl, "settings");
            } else {
                config.upiQrUrl = upiQrUrl;
            }
        }

        await config.save();

        res.status(200).json({
            success: true,
            message: "Settings updated successfully!",
            data: config
        });
    } catch (error) {
        next(error);
    }
};
