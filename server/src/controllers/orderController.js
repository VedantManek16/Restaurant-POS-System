import createHttpError from "http-errors";
import Order from "../models/orderModel.js";
import Table from "../models/tableModel.js";
import mongoose from "mongoose";

export const addOrder = async (req, res, next) => {
  try {
    const order = new Order({ ...req.body, restaurantId: req.user.tenantId });
    await order.save();
    res
      .status(201)
      .json({ success: true, message: "Order created!", data: order });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const order = await Order.findOne({ _id: id, restaurantId: req.user.tenantId });
    if (!order) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ restaurantId: req.user.tenantId }).populate("table");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const { orderStatus, items, bills, paymentMethod, paymentData } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const updateFields = {};
    if (orderStatus !== undefined) updateFields.orderStatus = orderStatus;
    if (items !== undefined) updateFields.items = items;
    if (bills !== undefined) updateFields.bills = bills;
    if (paymentMethod !== undefined) updateFields.paymentMethod = paymentMethod;
    if (paymentData !== undefined) updateFields.paymentData = paymentData;

    const order = await Order.findOneAndUpdate(
      { _id: id, restaurantId: req.user.tenantId },
      updateFields,
      { returnDocument: "after" }
    );

    if (!order) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    if (orderStatus === "Cancelled" && order.table) {
      await Table.findByIdAndUpdate(order.table, {
        status: "Available",
        currentOrder: null
      });
      // Also update any active table session to Cancelled
      await mongoose.model("TableSession").findOneAndUpdate(
        { table: order.table, status: "Active" },
        { status: "Cancelled" }
      );
    }

    res
      .status(200)
      .json({ success: true, message: "Order updated", data: order });
  } catch (error) {
    next(error);
  }
};
