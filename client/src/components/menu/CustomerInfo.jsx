import { useState } from "react";
import { formatDate } from "../../utils/dateFormatter";
import { useSelector } from "react-redux";
import { getInitials } from "@/utils/getInitials";
import { MdOutlineTableBar } from "react-icons/md";
import { FiUsers } from "react-icons/fi";

const CustomerInfo = () => {
    const [dateTime] = useState(new Date());
    const customerData = useSelector((state) => state.customer);

    const name = customerData?.customerName || "Walk-in Customer";
    const orderId = customerData?.orderId || "—";
    const tableNumber = customerData?.tableNumber || "Takeaway";
    const guests = customerData?.guests || 1;

    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2d2d]/30 shrink-0 bg-[#1c1c1c]/50">
            <div className="flex flex-col items-start gap-1">
                <h1 className="text-sm text-[#f5f5f5] font-bold tracking-wide truncate max-w-[240px]">
                    {name} {customerData?.customerMobileNumber && <span className="text-[10px] text-[#ababab] font-normal font-mono ml-1.5">({customerData.customerMobileNumber})</span>}
                </h1>
                
                {/* Meta details row */}
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    {/* Order ID */}
                    <span className="text-[9px] bg-[#2a2a2a] text-[#c8c8c8] px-2 py-0.5 rounded font-mono border border-[#3a3a3a] select-none font-semibold">
                        {orderId}
                    </span>
                    
                    {/* Table Number */}
                    <span className="text-[9px] bg-[#f6b100]/10 text-[#f6b100] px-2 py-0.5 rounded font-bold border border-[#f6b100]/20 flex items-center gap-1 select-none">
                        <MdOutlineTableBar size={10} className="shrink-0" />
                        T: {tableNumber}
                    </span>

                    {/* Guest Count */}
                    <span className="text-[9px] bg-[#02ca3a]/10 text-[#02ca3a] px-2 py-0.5 rounded font-bold border border-[#02ca3a]/20 flex items-center gap-1 select-none">
                        <FiUsers size={10} className="shrink-0" />
                        G: {guests}
                    </span>
                </div>
                
                <p className="text-[9px] text-[#666666] font-semibold mt-1">
                    {formatDate(dateTime)}
                </p>
            </div>
            <button className="bg-[#f6b100] hover:bg-[#f6b100]/90 transition-all active:scale-95 text-[#1a1a1a] w-10 h-10 flex items-center justify-center font-extrabold text-xs rounded-xl shrink-0 cursor-pointer shadow-md shadow-[#f6b100]/10 select-none">
                {getInitials(name)}
            </button>
        </div>
    );
};

export default CustomerInfo;