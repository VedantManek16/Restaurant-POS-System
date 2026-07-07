import { FaCircle, FaChair } from "react-icons/fa";
import { getInitials } from "../../utils/getInitials";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateTable } from "../../redux/slices/customerSlice";
const TableCard = ({ name, status, initials, seats, id }) => {
    const navigate = useNavigate();
    const isBooked = status?.toLowerCase() === "booked";
    const dispatch = useDispatch();
    const handleClick = (name) => {
        if (isBooked) {
            return "";
        } else {
            dispatch(updateTable({ tableNumber: name }))
            navigate(`/menu`);
        }
    };
    return (
        <div onClick={() => handleClick(name)} className="w-full max-w-[340px] bg-[#1a1a1a] p-4 rounded-xl border border-[#2d2d2d]/30 shadow-md flex flex-col hover:bg-[#202020] transition-colors duration-200">
            {/* Header info */}
            <div className="flex items-center justify-between">
                <h1 className="text-[#f5f5f5] text-sm font-semibold tracking-wide">{name}</h1>

                {/* Status Indicator matching OrderPage style */}
                <div>
                    {isBooked ? (
                        <span className="text-[#f6b100] text-[10px] font-semibold flex items-center gap-1.5 bg-[#f6b100]/10 px-2.5 py-0.5 rounded-md border border-[#f6b100]/25">
                            <FaCircle className="text-[7px] animate-pulse" /> Booked
                        </span>
                    ) : (
                        <span className="text-[#02ca3a] text-[10px] font-semibold flex items-center gap-1.5 bg-[#02ca3a]/10 px-2.5 py-0.5 rounded-md border border-[#02ca3a]/25">
                            <FaCircle className="text-[7px]" /> Available
                        </span>
                    )}
                </div>
            </div>

            {/* Occupant / Initials Section */}
            <div className="flex items-center gap-3 mt-3">
                {/* Avatar */}
                <div className={`${isBooked ? "bg-[#f6b100] text-[#1a1a1a]" : "bg-[#2d2d2d]/60 text-[#ababab] border border-[#4d4d4d]/20"
                    } w-8 h-8 flex items-center justify-center font-bold text-xs rounded-lg shrink-0`}>
                    {isBooked ? getInitials(initials) : "—"}
                </div>

                <div className="flex flex-col min-w-0">
                    <h1 className={`text-xs font-semibold tracking-wide truncate ${isBooked ? "text-[#f5f5f5]" : "text-[#ababab]"}`}>
                        {isBooked ? (initials && initials.length > 2 ? initials : "Guest Occupied") : "Vacant"}
                    </h1>
                    <p className="text-[#ababab] text-[10px] mt-0.5">
                        {isBooked ? "Active session" : "Ready for check-in"}
                    </p>
                </div>
            </div>

            {/* Divider line */}
            <div className="w-full border-t border-[#2d2d2d]/50 mt-3" />

            {/* Footer containing seats capacity */}
            <div className="flex justify-between items-center mt-3">
                <h1 className="text-[#ababab] text-[11px] font-medium">Capacity</h1>
                <p className="text-[#f5f5f5] text-xs font-semibold flex items-center gap-1.5">
                    <FaChair className="text-[#ababab] text-[11px]" /> {seats || 0} Seats
                </p>
            </div>
        </div>
    );
};

export default TableCard;