import { FaCheckDouble, FaCircle } from 'react-icons/fa';
import { getInitials } from '../../utils/getInitials';

const OrderList = ({ order }) => {
    if (!order) return null;

    const customerName = order.customerDetails?.name || "Walk-in Customer";
    const itemsCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const tableNo = order.table?.tableNo || "N/A";
    const status = order.orderStatus || "In Progress";
    const statusLower = status.toLowerCase();
    const isCancelled = statusLower === "cancelled";
    const isCompleted = statusLower === "completed";
    const isServed = statusLower === "served";
    const isReady = statusLower === "ready";

    return (
        <div className="flex items-center gap-4 py-2 border-b border-[#2d2d2d]/20 last:border-b-0">
            {/* Avatar Initials */}
            <div className="bg-[#f6b100] w-9 h-9 flex items-center justify-center font-bold text-[#1a1a1a] text-xs rounded-lg shrink-0">
                {getInitials(customerName)}
            </div>

            <div className="grid grid-cols-[1fr_140px_110px] items-center w-full min-w-0 gap-4">
                {/* Details */}
                <div className="flex flex-col items-start min-w-0 pr-2">
                    <h1 className="text-[#f5f5f5] text-sm font-semibold tracking-wide truncate">{customerName}</h1>
                    <p className="text-[#ababab] text-[11px] mt-0.5">{itemsCount} Items</p>
                </div>

                {/* Table Info */}
                <div className="flex justify-center">
                    <span className="text-[#f6b100] text-[11px] font-medium border border-[#f6b100] rounded-md px-2 py-0.5 bg-[#f6b100]/5 whitespace-nowrap">
                        Table No: {tableNo}
                    </span>
                </div>

                {/* Status Indicator */}
                <div className="flex flex-col items-end gap-0.5 shrink-0 text-right">
                    {isCancelled && (
                        <>
                            <p className="text-red-400 text-xs font-semibold flex items-center gap-1">
                                Cancelled
                            </p>
                            <p className="text-[#ababab] text-[10px] flex items-center gap-1.5 mt-0.5">
                                Voided & closed
                            </p>
                        </>
                    )}
                    {isCompleted && (
                        <>
                            <p className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                                <FaCheckDouble className="text-[10px]" /> Paid
                            </p>
                            <p className="text-[#ababab] text-[10px] flex items-center gap-1.5 mt-0.5">
                                Paid & closed
                            </p>
                        </>
                    )}
                    {isServed && (
                        <>
                            <p className="text-[#025cca] text-xs font-semibold flex items-center gap-1">
                                <FaCheckDouble className="text-[10px]" /> Served
                            </p>
                            <p className="text-yellow-400 text-[10px] flex items-center gap-1.5 mt-0.5">
                                Awaiting Payment
                            </p>
                        </>
                    )}
                    {isReady && (
                        <>
                            <p className="text-[#f6b100] text-xs font-semibold flex items-center gap-1">
                                <FaCheckDouble className="text-[10px]" /> Ready
                            </p>
                            <p className="text-[#ababab] text-[10px] flex items-center gap-1.5 mt-0.5">
                                Ready to serve
                            </p>
                        </>
                    )}
                    {!isCancelled && !isCompleted && !isServed && !isReady && (
                        <>
                            <p className="text-[#ababab] text-xs font-semibold flex items-center gap-1">
                                <FaCircle className="text-[8px] animate-pulse" /> Preparing
                            </p>
                            <p className="text-[#ababab] text-[10px] flex items-center gap-1.5 mt-0.5">
                                In kitchen
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderList;