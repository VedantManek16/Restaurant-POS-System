import { FaSearch } from "react-icons/fa";
import OrderList from "./OrderList";
import { useState, useEffect } from "react";
import { apiRequest } from "../../utils/api";

const RecentOrders = () => {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                const res = await apiRequest("/order");
                if (res && res.data) {
                    // sort by date descending
                    const sorted = res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                    setOrders(sorted);
                }
            } catch (error) {
                console.error("Error fetching recent orders:", error);
            }
        };
        fetchRecentOrders();
    }, []);

    const filteredOrders = orders.filter(order => {
        const name = order.customerDetails?.name || "Walk-in Customer";
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="px-8 mt-5 flex-1 min-h-0 flex flex-col pb-4">
            <div className="bg-[#1a1a1a] w-full flex-1 flex flex-col rounded-xl border border-[#2d2d2d]/30 overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4">
                    <h1 className="text-[#f5f5f5] text-md font-semibold tracking-wide">Recent Orders</h1>
                    <a href="/orders" className="text-[#025cca] text-xs font-semibold hover:underline">View all</a>
                </div>
                {/* Search bar */}
                <div className="flex items-center gap-3 bg-[#1f1f1f] rounded-xl px-4 py-2 mx-6 border border-[#2d2d2d]/30">
                    <FaSearch className="text-[#ababab] text-xs" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search recent orders"
                        className="bg-[#1f1f1f] outline-none text-[#f5f5f5] text-xs placeholder-[#ababab] w-full"
                    />
                </div >
                {/* Order list */}
                <div className="mt-4 px-6 overflow-y-auto flex-1 scrollbar-hide pb-2">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.slice(0, 10).map((order) => (
                            <OrderList key={order._id} order={order} />
                        ))
                    ) : (
                        <p className="text-gray-500 text-xs text-center mt-10">No orders available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecentOrders;