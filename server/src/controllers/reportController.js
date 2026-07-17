import Order from "../models/orderModel.js";

export const getAnalytics = async (req, res, next) => {
    try {
        const restaurantId = req.user.tenantId;

        // Date ranges for today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        // Aggregate statistics for today
        const todayStats = await Order.aggregate([
            {
                $match: {
                    restaurantId,
                    orderDate: { $gte: startOfToday, $lte: endOfToday }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$bills.totalWithTax" },
                    orderCount: { $sum: 1 },
                    avgTicket: { $avg: "$bills.totalWithTax" }
                }
            }
        ]);

        // Aggregate all-time statistics
        const allTimeStats = await Order.aggregate([
            {
                $match: { restaurantId }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$bills.totalWithTax" },
                    orderCount: { $sum: 1 },
                    avgTicket: { $avg: "$bills.totalWithTax" }
                }
            }
        ]);

        // Calculate average prep time for completed/ready orders
        const prepTimeStats = await Order.aggregate([
            {
                $match: {
                    restaurantId,
                    orderStatus: { $in: ["Ready", "Completed", "Served"] },
                    orderDate: { $gte: startOfToday, $lte: endOfToday }
                }
            },
            {
                $project: {
                    durationMinutes: {
                        $divide: [
                            { $subtract: ["$updatedAt", "$createdAt"] },
                            60000 // ms to minutes
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    avgPrep: { $avg: "$durationMinutes" }
                }
            }
        ]);

        const todaySales = todayStats[0]?.totalSales || 0;
        const todayCount = todayStats[0]?.orderCount || 0;
        const todayAvg = todayStats[0]?.avgTicket || 0;
        const avgPrep = prepTimeStats[0]?.avgPrep ? parseFloat(prepTimeStats[0].avgPrep.toFixed(1)) : 14.2;

        const inProgressCount = await Order.countDocuments({
            restaurantId,
            orderStatus: { $in: ["In Progress", "Preparing"] }
        });

        // Hourly sales split for today
        const hourlyStats = await Order.aggregate([
            {
                $match: {
                    restaurantId,
                    orderDate: { $gte: startOfToday, $lte: endOfToday }
                }
            },
            {
                $project: {
                    hour: { $hour: { date: "$orderDate", timezone: "+05:30" } },
                    amount: "$bills.totalWithTax"
                }
            },
            {
                $group: {
                    _id: "$hour",
                    sales: { $sum: "$amount" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Daily sales split for last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const dailyStats = await Order.aggregate([
            {
                $match: {
                    restaurantId,
                    orderDate: { $gte: sevenDaysAgo }
                }
            },
            {
                $project: {
                    day: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate", timezone: "+05:30" } },
                    amount: "$bills.totalWithTax"
                }
            },
            {
                $group: {
                    _id: "$day",
                    sales: { $sum: "$amount" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                today: {
                    sales: todaySales,
                    count: todayCount,
                    avgTicket: todayAvg,
                    avgPrep: avgPrep,
                    inProgress: inProgressCount
                },
                allTime: {
                    sales: allTimeStats[0]?.totalSales || 0,
                    count: allTimeStats[0]?.orderCount || 0,
                    avgTicket: allTimeStats[0]?.avgTicket || 0
                },
                hourlySales: hourlyStats,
                dailySales: dailyStats
            }
        });

    } catch (error) {
        next(error);
    }
};

export const getReportData = async (req, res, next) => {
    try {
        const restaurantId = req.user.tenantId;
        const { reportType } = req.params;

        if (reportType === "daily-sales") {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);
            const endOfToday = new Date();
            endOfToday.setHours(23, 59, 59, 999);

            const orders = await Order.find({
                restaurantId,
                orderDate: { $gte: startOfToday, $lte: endOfToday }
            }).sort({ orderDate: -1 });

            const data = orders.map(o => ({
                orderId: o.orderId || o._id,
                customerName: o.customerDetails?.name || "Walk-in Customer",
                itemsCount: o.items?.reduce((sum, i) => sum + i.quantity, 0) || 0,
                subtotal: o.bills?.subtotal || 0,
                taxAmount: o.bills?.taxAmount || 0,
                total: o.bills?.totalWithTax || 0,
                paymentMethod: o.paymentMethod || "Cash",
                date: o.orderDate ? new Date(o.orderDate).toLocaleString() : "N/A"
            }));

            return res.status(200).json({ success: true, data });

        } else if (reportType === "weekly-performance") {
            const startOfLast30Days = new Date();
            startOfLast30Days.setDate(startOfLast30Days.getDate() - 30);
            startOfLast30Days.setHours(0, 0, 0, 0);

            const stats = await Order.aggregate([
                {
                    $match: {
                        restaurantId,
                        orderDate: { $gte: startOfLast30Days }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-W%V", date: "$orderDate", timezone: "+05:30" } },
                        ordersCount: { $sum: 1 },
                        totalSales: { $sum: "$bills.totalWithTax" }
                    }
                },
                {
                    $sort: { _id: -1 }
                }
            ]);

            const data = stats.map(s => ({
                week: s._id,
                ordersCount: s.ordersCount,
                totalSales: s.totalSales
            }));

            return res.status(200).json({ success: true, data });

        } else if (reportType === "monthly-tax") {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const orders = await Order.find({
                restaurantId,
                orderDate: { $gte: startOfMonth }
            }).sort({ orderDate: -1 });

            const data = orders.map(o => ({
                date: o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "N/A",
                orderId: o.orderId || o._id,
                taxRate: o.bills?.taxPercent || 18,
                taxCollected: o.bills?.taxAmount || 0,
                paymentMethod: o.paymentMethod || "Cash",
                total: o.bills?.totalWithTax || 0
            }));

            return res.status(200).json({ success: true, data });
        }

        return res.status(400).json({ success: false, message: "Invalid report type." });

    } catch (error) {
        next(error);
    }
};
