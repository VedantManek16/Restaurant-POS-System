import Settings from "../models/settingsModel.js";
import createHttpError from "http-errors";

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
            serviceCharge,
            receiptFooter
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
        if (serviceCharge !== undefined) config.serviceCharge = Number(serviceCharge);
        if (receiptFooter !== undefined) config.receiptFooter = receiptFooter;

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
