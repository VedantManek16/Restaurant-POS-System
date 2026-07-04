import { FaCheckDouble, FaCircle } from "react-icons/fa";
import { getInitials } from "../../utils/getInitials";

const OrderCard = ({ order }) => {
    if (!order) return null;

    const { customerName, id, status, orderType, tableNo, itemsCount, date, total } = order;

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
                                <span className="text-[#02ca3a] text-[10px] font-semibold flex items-center gap-1 bg-[#02ca3a]/10 px-2 py-0.5 rounded-md border border-[#02ca3a]/25">
                                    <FaCheckDouble className="text-[8px]" /> Ready
                                </span>
                                <p className="text-[#ababab] text-[9px] flex items-center gap-1 mt-0.5">
                                    <FaCircle className="text-[#02ca3a] text-[7px]" /> Ready to serve
                                </p>
                            </>
                        )}
                        {status === "progress" && (
                            <>
                                <span className="text-[#f6b100] text-[10px] font-semibold flex items-center gap-1 bg-[#f6b100]/10 px-2 py-0.5 rounded-md border border-[#f6b100]/25">
                                    <FaCircle className="text-[7px] animate-pulse" /> Preparing
                                </span>
                                <p className="text-[#ababab] text-[9px] flex items-center gap-1 mt-0.5">
                                    In kitchen
                                </p>
                            </>
                        )}
                        {status === "completed" && (
                            <>
                                <span className="text-[#025cca] text-[10px] font-semibold flex items-center gap-1 bg-[#025cca]/10 px-2 py-0.5 rounded-md border border-[#025cca]/25">
                                    <FaCheckDouble className="text-[8px]" /> Served
                                </span>
                                <p className="text-[#ababab] text-[9px] flex items-center gap-1 mt-0.5">
                                    Paid & closed
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="flex justify-between items-center mt-3 text-[10px] text-[#ababab] font-medium">
                <p>{date}</p>
                <p className="text-white">{itemsCount} Items</p>
            </div>
            
            <div className="w-full border-t border-[#2d2d2d]/50 mt-3" />
            
            <div className="flex justify-between items-center mt-3">
                <h1 className="text-[#ababab] text-[11px] font-medium">Total</h1>
                <p className="text-[#f5f5f5] text-sm font-semibold">₹{total.toFixed(2)}</p>
            </div>
        </div>
    )
}

export default OrderCard;