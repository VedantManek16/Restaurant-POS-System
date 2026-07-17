import { FaSearch } from "react-icons/fa";
import OrderList from "./OrderList";
import { useState, useEffect } from "react";
import { apiRequest } from "../../utils/api";

const RecentOrders = () => {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        const loadRecentOrders = async () => {
            try {
                const res = await apiRequest("/order");
                if (res && res.data) {
                    const sorted = res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                    setOrders(sorted);
                }
            } catch (error) {
                console.error("Error fetching recent orders:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadRecentOrders();
    }, []);

    const filteredOrders = orders.filter(order => {
        const name = order.customerDetails?.name || "Walk-in Customer";
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="px-8 mt-5 flex flex-col pb-4">
            <div className="bg-[#1a1a1a] w-full flex flex-col rounded-xl border border-[#2d2d2d]/30 overflow-hidden pb-4">
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
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="Search recent orders"
                        className="bg-[#1f1f1f] outline-none text-[#f5f5f5] text-xs placeholder-[#ababab] w-full"
                    />
                </div >
                {/* Order list */}
                <div className="mt-4 px-6 pb-2 space-y-1">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, idx) => (
                            <div key={idx} className="flex justify-between items-center py-3 border-b border-[#2d2d2d]/10 animate-pulse">
                                <div className="flex flex-col gap-2 w-1/3">
                                    <div className="h-3 bg-neutral-800 rounded w-3/4"></div>
                                    <div className="h-2 bg-neutral-800 rounded w-1/2"></div>
                                </div>
                                <div className="h-5 bg-neutral-800 rounded-lg w-12"></div>
                                <div className="h-6 bg-neutral-800 rounded-lg w-16"></div>
                            </div>
                        ))
                    ) : paginatedOrders.length > 0 ? (
                        paginatedOrders.map((order) => (
                            <OrderList key={order._id} order={order} />
                        ))
                    ) : (
                        <p className="text-gray-500 text-xs text-center mt-10">No orders available</p>
                    )}
                </div>

                {/* Compact Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center px-6 pt-3 mt-2 border-t border-[#2d2d2d]/10 text-[10px] text-[#ababab]">
                        <span className="font-medium">Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length}</span>
                        <div className="flex items-center gap-1">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                className="px-2.5 py-1 rounded-lg bg-[#262626] border border-white/5 disabled:opacity-35 hover:bg-[#333] hover:text-white cursor-pointer disabled:cursor-not-allowed transition-all font-bold text-[9px] uppercase tracking-wider"
                            >
                                Prev
                            </button>
                            <span className="px-1.5 font-bold text-white">Page {currentPage} of {totalPages}</span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                className="px-2.5 py-1 rounded-lg bg-[#262626] border border-white/5 disabled:opacity-35 hover:bg-[#333] hover:text-white cursor-pointer disabled:cursor-not-allowed transition-all font-bold text-[9px] uppercase tracking-wider"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentOrders;