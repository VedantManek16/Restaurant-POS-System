import BottomNav from "../components/shared/BottomNav"
import OrderCard from "../components/orders/OrderCard"
import BackButton from "../components/shared/BackButton"
import { useState, useEffect } from "react";
import { apiRequest } from "../utils/api";
import { toast } from "react-hot-toast";

const Orders = () => {
  const [status, setStatus] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all-time"); // "all-time", "today", "hour"
  const [ordersData, setOrdersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await apiRequest("/order");
        if (res && res.data) {
          setOrdersData(res.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await apiRequest(`/order/${orderId}`, {
        method: "PUT",
        body: { orderStatus: newStatus }
      });
      if (res.success) {
        toast.success(`Order status updated to ${newStatus}`);
        const freshRes = await apiRequest("/order");
        if (freshRes && freshRes.data) {
          setOrdersData(freshRes.data);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update status.");
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  const handleTimeFilterChange = (newTimeFilter) => {
    setTimeFilter(newTimeFilter);
    setCurrentPage(1);
  };

  let tempOrders = ordersData.filter(order => {
    const orderStatus = order.orderStatus?.toLowerCase();
    if (status === "all") return true;
    if (status === "progress") return orderStatus === "in progress" || orderStatus === "preparing";
    if (status === "ready") return orderStatus === "ready";
    if (status === "completed") return orderStatus === "completed" || orderStatus === "served";
    return false;
  });

  const now = new Date();
  tempOrders = tempOrders.filter(order => {
    if (timeFilter === "all-time") return true;
    const orderDate = new Date(order.orderDate || order.createdAt);
    const diffMs = now - orderDate;
    if (timeFilter === "hour") {
      return diffMs <= 60 * 60 * 1000;
    }
    if (timeFilter === "today") {
      return orderDate.getDate() === now.getDate() &&
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const totalPages = Math.ceil(tempOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = tempOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-4.5rem)] overflow-hidden flex flex-col pb-16 md:pb-0">
      {/* Header section with Filter tabs */}
      <div className="flex items-center justify-between px-10 py-4 shrink-0 bg-[#171717]/40 border-b border-[#2d2d2d]/25">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-xl font-bold tracking-wide">Orders</h1>
        </div>

        {/* Filters Toolbar - height 40px, spacing 16px, consistent design */}
        <div className="flex items-center gap-4 h-10 shrink-0">
          {/* Status Segmented Control */}
          <div className="flex items-center bg-[#151515] p-1 rounded-xl border border-white/5 h-10">
            <button
              onClick={() => handleStatusChange("all")}
              className={`h-8 px-4 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none ${status === "all"
                  ? "bg-[#2d2d2d] text-white shadow-md border border-white/5"
                  : "text-[#ababab] hover:text-[#f5f5f5]"
                }`}
            >
              All
            </button>
            <button
              onClick={() => handleStatusChange("progress")}
              className={`h-8 px-4 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none ${status === "progress"
                  ? "bg-[#2d2d2d] text-white shadow-md border border-white/5"
                  : "text-[#ababab] hover:text-[#f5f5f5]"
                }`}
            >
              In Progress
            </button>
            <button
              onClick={() => handleStatusChange("ready")}
              className={`h-8 px-4 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none ${status === "ready"
                  ? "bg-[#2d2d2d] text-white shadow-md border border-white/5"
                  : "text-[#ababab] hover:text-[#f5f5f5]"
                }`}
            >
              Ready
            </button>
            <button
              onClick={() => handleStatusChange("completed")}
              className={`h-8 px-4 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none ${status === "completed"
                  ? "bg-[#2d2d2d] text-white shadow-md border border-white/5"
                  : "text-[#ababab] hover:text-[#f5f5f5]"
                }`}
            >
              Completed
            </button>
          </div>

          <span className="w-px h-6 bg-[#2d2d2d]/60 shrink-0"></span>

          {/* Time Filter Segmented Control */}
          <div className="flex items-center bg-[#151515] p-1 rounded-xl border border-white/5 h-10">
            <button
              onClick={() => handleTimeFilterChange("all-time")}
              className={`h-8 px-4 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none ${timeFilter === "all-time"
                  ? "bg-[#F4B400] text-gray-950 shadow-md font-bold"
                  : "text-[#ababab] hover:text-[#f5f5f5]"
                }`}
            >
              All Time
            </button>
            <button
              onClick={() => handleTimeFilterChange("today")}
              className={`h-8 px-4 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none ${timeFilter === "today"
                  ? "bg-[#F4B400] text-gray-950 shadow-md font-bold"
                  : "text-[#ababab] hover:text-[#f5f5f5]"
                }`}
            >
              Today
            </button>
            <button
              onClick={() => handleTimeFilterChange("hour")}
              className={`h-8 px-4 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none ${timeFilter === "hour"
                  ? "bg-[#F4B400] text-gray-950 shadow-md font-bold"
                  : "text-[#ababab] hover:text-[#f5f5f5]"
                }`}
            >
              Last 1 Hr
            </button>
          </div>
        </div>
      </div>

      {/* Grid container for OrderCards */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-10 py-4">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12 justify-items-center">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 w-full max-w-[340px] h-[220px] animate-pulse flex flex-col justify-between">
                <div className="flex justify-between items-center w-full">
                  <div className="h-4 bg-neutral-800 rounded w-1/3"></div>
                  <div className="h-4 bg-neutral-800 rounded w-1/4"></div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="h-3 bg-neutral-800 rounded w-3/4"></div>
                  <div className="h-3 bg-neutral-800 rounded w-1/2"></div>
                </div>
                <div className="flex justify-between items-center w-full mt-6 border-t border-[#2d2d2d]/20 pt-4">
                  <div className="h-5 bg-neutral-800 rounded w-1/4"></div>
                  <div className="h-7 bg-neutral-800 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : paginatedOrders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12 justify-items-center">
            {paginatedOrders.map(order => (
              <OrderCard key={order._id} order={order} onStatusUpdate={handleStatusUpdate} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-xs font-semibold">
            No orders found matching the selected filters.
          </div>
        )}
      </div>

      {/* Pagination Footer - with summary on left and controls on right/center */}
      {tempOrders.length > 0 && (
        <div className="flex justify-between items-center px-10 py-4 bg-[#1a1a1a]/50 border-t border-[#2d2d2d]/30 shrink-0">
          <span className="text-xs text-[#ababab] font-medium">
            Showing <span className="text-white font-semibold">{startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, tempOrders.length)}</span> of <span className="text-white font-semibold">{tempOrders.length}</span> Orders
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#262626] text-[#ababab] disabled:opacity-30 border border-white/5 hover:bg-[#333] hover:text-white cursor-pointer transition-all duration-150 disabled:cursor-not-allowed select-none"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer select-none ${currentPage === pageNum
                      ? "bg-[#F4B400] text-gray-950 shadow-lg shadow-[#F4B400]/15 font-bold"
                      : "border border-white/5 bg-[#262626] text-[#ababab] hover:bg-[#333] hover:text-white"
                    }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#262626] text-[#ababab] disabled:opacity-30 border border-white/5 hover:bg-[#333] hover:text-white cursor-pointer transition-all duration-150 disabled:cursor-not-allowed select-none"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
      <BottomNav />
    </section>
  )
}

export default Orders