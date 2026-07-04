import { FaCheckDouble, FaCircle } from 'react-icons/fa';

const OrderList = () => {
    return (
        <div className="flex items-center gap-4 py-2 border-b border-[#2d2d2d]/20 last:border-b-0">
            {/* Avatar Initials */}
            <div className="bg-[#f6b100] w-9 h-9 flex items-center justify-center font-bold text-[#1a1a1a] text-xs rounded-lg shrink-0">
                VM
            </div>

            <div className="flex items-center justify-between w-full min-w-0">
                {/* Details */}
                <div className="flex flex-col items-start min-w-0 pr-2">
                    <h1 className="text-[#f5f5f5] text-sm font-semibold tracking-wide truncate">Vedant Manek</h1>
                    <p className="text-[#ababab] text-[11px] mt-0.5">8 Items</p>
                </div>

                {/* Table Info */}
                <div className="shrink-0">
                    <span className="text-[#f6b100] text-[11px] font-medium border border-[#f6b100] rounded-md px-2 py-0.5 bg-[#f6b100]/5">
                        Table No: 3
                    </span>
                </div>

                {/* Status Indicator */}
                <div className="flex flex-col items-start gap-0.5 shrink-0 text-right">
                    <p className="text-[#02ca3a] text-xs font-semibold flex items-center gap-1">
                        <FaCheckDouble className="text-[10px]" /> Ready
                    </p>
                    <p className="text-[#ababab] text-[10px] flex items-center gap-1.5 mt-0.5">
                        <FaCircle className="text-[#02ca3a] text-[8px]" /> Ready to serve
                    </p>
                </div>
            </div>
        </div>
    )
}

export default OrderList;