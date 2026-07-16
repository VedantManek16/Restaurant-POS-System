import createHttpError from "http-errors";
import TableSession from "../models/tableSessionModel.js";
import Order from "../models/orderModel.js";
import Table from "../models/tableModel.js";
import mongoose from "mongoose";

export const createSession = async (req, res, next) => {
    try {
        const { tableId, customerDetails, items, bills, orderId } = req.body;

        if (!tableId || !customerDetails || !items || !bills || !orderId) {
            const error = createHttpError(400, "Missing required session details.");
            return next(error);
        }

        // 1. Create first kitchen order
        const newOrder = new Order({
            orderId,
            restaurantId: req.user.tenantId,
            customerDetails,
            orderStatus: "In Progress",
            bills: {
                total: bills.total,
                tax: bills.tax,
                totalWithTax: bills.totalWithTax
            },
            items,
            table: tableId
        });
        await newOrder.save();

        // 2. Create the Table Session
        const newSession = new TableSession({
            table: tableId,
            restaurantId: req.user.tenantId,
            customerDetails,
            orders: [newOrder._id],
            bills: {
                subtotal: bills.total,
                tax: bills.tax,
                total: bills.totalWithTax
            },
            status: "Active"
        });
        await newSession.save();

        // 3. Update table status and point currentOrder to session ID
        await Table.findByIdAndUpdate(tableId, {
            status: "Booked",
            currentOrder: newSession._id
        });

        const populatedSession = await TableSession.findById(newSession._id).populate("orders");

        res.status(201).json({
            success: true,
            message: "Table session started!",
            data: populatedSession
        });
    } catch (error) {
        next(error);
    }
};

export const addSessionOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { items, bills, orderId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = createHttpError(400, "Invalid session ID.");
            return next(error);
        }

        const session = await TableSession.findById(id);
        if (!session) {
            const error = createHttpError(404, "Session not found.");
            return next(error);
        }

        // 1. Create new kitchen order
        const newOrder = new Order({
            orderId,
            restaurantId: req.user.tenantId,
            customerDetails: session.customerDetails,
            orderStatus: "In Progress",
            bills: {
                total: bills.total,
                tax: bills.tax,
                totalWithTax: bills.totalWithTax
            },
            items,
            table: session.table
        });
        await newOrder.save();

        // 2. Append order and recalculate consolidated bill
        session.orders.push(newOrder._id);

        const orders = await Order.find({ _id: { $in: session.orders } });
        let subtotal = 0;
        let tax = 0;
        let total = 0;

        orders.forEach(o => {
            subtotal += o.bills.total || 0;
            tax += o.bills.tax || 0;
            total += o.bills.totalWithTax || 0;
        });

        session.bills = { subtotal, tax, total };
        await session.save();

        const populatedSession = await TableSession.findById(id).populate("orders");

        res.status(201).json({
            success: true,
            message: "Kitchen order added successfully!",
            data: populatedSession
        });
    } catch (error) {
        next(error);
    }
};

export const getSession = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = createHttpError(400, "Invalid session ID.");
            return next(error);
        }

        const session = await TableSession.findById(id).populate("orders").populate("table");
        if (!session) {
            const error = createHttpError(404, "Session not found.");
            return next(error);
        }

        res.status(200).json({ success: true, data: session });
    } catch (error) {
        next(error);
    }
};

export const paySession = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { paymentMethod, paymentData } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = createHttpError(400, "Invalid session ID.");
            return next(error);
        }

        const session = await TableSession.findById(id);
        if (!session) {
            const error = createHttpError(404, "Session not found.");
            return next(error);
        }

        // 1. Mark session as Paid
        session.status = "Paid";
        session.paymentMethod = paymentMethod || "Cash";
        session.paymentData = paymentData || {};
        await session.save();

        // 2. Set all associated orders to Completed/Paid
        await Order.updateMany(
            { _id: { $in: session.orders } },
            { 
                orderStatus: "Completed",
                paymentMethod: paymentMethod || "Cash",
                paymentData: paymentData || {}
            }
        );

        // 3. Release the Table
        await Table.findByIdAndUpdate(session.table, {
            status: "Available",
            currentOrder: null
        });

        res.status(200).json({
            success: true,
            message: "Payment processed & table session completed!"
        });
    } catch (error) {
        next(error);
    }
};
