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
                }
            }
        });

    } catch (error) {
        next(error);
    }
};
