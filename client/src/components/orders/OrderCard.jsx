import { useState } from "react";
import { FaCheckDouble, FaCircle } from "react-icons/fa";
import { getInitials } from "../../utils/getInitials";
import { useSelector } from "react-redux";

const OrderCard = ({ order, onStatusUpdate }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { user } = useSelector((state) => state.user);
    const isWaiter = user?.role === "Waiter";
    const isKitchen = user?.role === "Kitchen Staff";
    const isCashier = user?.role === "Cashier";
    const isRestaurantAdmin = user?.role === "Restaurant Admin" || user?.role === "Super Admin";

    if (!order) return null;

    const customerName = order.customerDetails?.name || "Walk-in Customer";
    const id = order._id ? `#ORD-${order._id.substring(order._id.length - 6).toUpperCase()}` : "N/A";
    const isCancelled = order.orderStatus?.toLowerCase() === "cancelled";
    const status = isCancelled
        ? "cancelled"
        : (order.orderStatus?.toLowerCase() === "in progress"
            ? "progress"
            : order.orderStatus?.toLowerCase() === "preparing"
                ? "preparing"
                : order.orderStatus?.toLowerCase() === "ready"
                    ? "ready"
                    : order.orderStatus?.toLowerCase() === "served"
                        ? "served"
                        : "completed");
    const orderType = order.table ? "Dine in" : "Takeaway";
    const tableNo = order.table?.tableNo || "N/A";
    const itemsCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const date = new Date(order.orderDate).toLocaleString();
    const total = order.bills?.totalWithTax || 0;

    return (
        <div className="w-full max-w-[340px] bg-[#1a1a1a] p-4 rounded-xl border border-[#2d2d2d]/30 shadow-md flex flex-col hover:bg-[#202020] transition-colors duration-200">
            <div className="flex items-center gap-3">
                {/* Avatar Initials */}
                <div className="bg-[#f6b100] w-8 h-8 flex items-center justify-center font-bold text-[#1a1a1a] text-xs rounded-lg shrink-0">
                    {getInitials(customerName)}
                </div>

                <div className="flex items-center justify-between w-full min-w-0">
                    {/* Details */}
                    <div className="flex flex-col items-start min-w-0 pr-1">
                        <h1 className="text-[#f5f5f5] text-xs font-semibold tracking-wide truncate">{customerName}</h1>
                        <p className="text-[#ababab] text-[10px] mt-0.5">
                            {id} / {orderType} {tableNo && tableNo !== "N/A" && `/ Table: ${tableNo}`}
                        </p>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex flex-col items-end shrink-0 text-right">
                        {status === "ready" && (
                            <>
                                <span className="text-[#f6b100] text-[10px] font-semibold flex items-center gap-1 bg-[#f6b100]/10 px-2 py-0.5 rounded-md border border-[#f6b100]/25">
                                    <FaCheckDouble className="text-[8px]" /> Ready
                                </span>
                                <p className="text-[#ababab] text-[9px] flex items-center gap-1 mt-0.5">
                                    Ready to serve
                                </p>
                            </>
                        )}
                        {status === "progress" && (
                            <>
                                <span className="text-[#a855f7] text-[10px] font-semibold flex items-center gap-1 bg-[#a855f7]/10 px-2 py-0.5 rounded-md border border-[#a855f7]/25">
                                    <FaCircle className="text-[7px] animate-pulse" /> Pending
                                </span>
                                <p className="text-[#ababab] text-[9px] flex items-center gap-1 mt-0.5">
                                    In kitchen queue
                                </p>
                            </>
                        )}
                        {status === "preparing" && (
                            <>
                                <span className="text-[#f6b100] text-[10px] font-semibold flex items-center gap-1 bg-[#f6b100]/10 px-2 py-0.5 rounded-md border border-[#f6b100]/25">
                                    <FaCircle className="text-[7px] animate-pulse" /> Preparing
                                </span>
                                <p className="text-[#ababab] text-[9px] flex items-center gap-1 mt-0.5">
                                    Cooking food
                                </p>
                            </>
                        )}
                        {status === "served" && (
                            <>
                                <span className="text-[#025cca] text-[10px] font-semibold flex items-center gap-1 bg-[#025cca]/10 px-2 py-0.5 rounded-md border border-[#025cca]/25">
                                    <FaCheckDouble className="text-[8px]" /> Served
                                </span>
                                <p className="text-yellow-400 text-[9px] flex items-center gap-1 mt-0.5">
                                    Awaiting Payment
                                </p>
                            </>
                        )}
                        {status === "completed" && (
                            <>
                                <span className="text-[#02ca3a] text-[10px] font-semibold flex items-center gap-1 bg-[#02ca3a]/10 px-2 py-0.5 rounded-md border border-[#02ca3a]/25">
                                    <FaCheckDouble className="text-[8px]" /> Paid
                                </span>
                                <p className="text-[#ababab] text-[9px] flex items-center gap-1 mt-0.5">
                                    Paid & closed
                                </p>
                            </>
                        )}
                        {status === "cancelled" && (
                            <>
                                <span className="text-red-400 text-[10px] font-semibold flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/25">
                                    Cancelled
                                </span>
                                <p className="text-[#ababab] text-[9px] flex items-center gap-1 mt-0.5">
                                    Voided & closed
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div 
                onClick={() => setIsExpanded(!isExpanded)}
                className="cursor-pointer select-none flex justify-between items-center mt-3 text-[10px] text-[#ababab] font-medium hover:text-white transition-colors"
            >
                <p>{date}</p>
                <p className="underline decoration-dotted">{itemsCount} Items {isExpanded ? "▲" : "▼"}</p>
            </div>

            {isExpanded && (
                <div className="mt-3 pt-3 border-t border-[#2d2d2d]/30 space-y-2 text-xs">
                    <h3 className="text-[#ababab] font-bold text-[9px] uppercase tracking-wider mb-1">Ordered Items</h3>
                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto scrollbar-hide pr-1">
                        {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start text-gray-300">
                                <div className="min-w-0 flex-1 pr-2">
                                    <p className="font-medium text-[#e4e4e4] truncate">
                                        {item.name} <span className="text-[#888] font-bold text-[10px] ml-1">x{item.quantity}</span>
                                    </p>
                                    {item.notes && <p className="text-[9px] text-[#f6b100]/80 italic mt-0.5">* {item.notes}</p>}
                                </div>
                                <span className="font-bold text-gray-400 shrink-0">₹{(item.price || (item.pricePerQuantity * item.quantity)).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="w-full border-t border-[#2d2d2d]/50 mt-3" />

            <div className="flex justify-between items-center mt-3">
                <h1 className="text-[#ababab] text-[11px] font-medium">Total</h1>
                <p className="text-[#f5f5f5] text-sm font-semibold">₹{total.toFixed(2)}</p>
            </div>

            {status !== "completed" && status !== "cancelled" && onStatusUpdate && (
                <div className="mt-3 pt-3 border-t border-[#2d2d2d]/50 flex justify-end gap-2">
                    {!isWaiter && !isKitchen && (
                        <button
                            onClick={() => {
                                if (window.confirm("Are you sure you want to cancel this order?")) {
                                    onStatusUpdate(order._id, "Cancelled");
                                }
                            }}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors mr-auto border-transparent"
                        >
                            Cancel
                        </button>
                    )}
                    {status === "progress" && (isKitchen || isRestaurantAdmin || isCashier) && (
                        <button
                            onClick={() => onStatusUpdate(order._id, "Preparing")}
                            className="bg-[#a855f7] hover:bg-[#9333ea] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                        >
                            Mark Preparing
                        </button>
                    )}
                    {status === "preparing" && (isKitchen || isRestaurantAdmin || isCashier) && (
                        <button
                            onClick={() => onStatusUpdate(order._id, "Ready")}
                            className="bg-[#f6b100] hover:bg-[#e0a100] text-[#1a1a1a] px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                        >
                            Mark Ready
                        </button>
                    )}
                    {status === "ready" && (isWaiter || isRestaurantAdmin || isCashier) && (
                        <button
                            onClick={() => onStatusUpdate(order._id, "Served")}
                            className="bg-[#025cca] hover:bg-[#024cab] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                        >
                            Mark Served
                        </button>
                    )}
                    {status === "served" && (isRestaurantAdmin || isCashier) && (
                        <button
                            onClick={() => onStatusUpdate(order._id, "Completed")}
                            className="bg-[#02ca3a] hover:bg-[#02a02e] text-[#1a1a1a] px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                        >
                            Mark Paid
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default OrderCard;