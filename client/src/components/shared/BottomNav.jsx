import { FaHome, FaUsers, FaCog } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar } from "react-icons/md";
import { BiSolidDish } from 'react-icons/bi';
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import CreateOrderModal from "./CreateOrderModal";
import { ROUTE_ACCESS } from "../../constants/roles";

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.user);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => setIsModalOpen(false);
    const openModal = () => setIsModalOpen(true);

    const hasAccess = (path) => {
        if (!user) return false;
        return ROUTE_ACCESS[path]?.includes(user.role);
    };

    const isActive = (path) => {
        return location.pathname === path
            ? "text-[#f5f5f5] bg-[#2d2d2d] hover:bg-[#343434] border-[#3d3d3d]/20 font-semibold"
            : "text-[#ababab] hover:text-[#f5f5f5] bg-transparent border-transparent font-medium";
    };

    if (!user) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1e1e1e] border-t border-[#2d2d2d]/30 px-6 h-16 flex items-center justify-around z-50 md:hidden">
            {/* 1. Home */}
            {hasAccess("/dashboard") && (
                <button
                    onClick={() => navigate("/dashboard")}
                    className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-full border transition-all cursor-pointer ${isActive("/dashboard")}`}
                >
                    <FaHome size={14} />
                    <span className="text-[10px]">Home</span>
                </button>
            )}

            {/* 2. Orders */}
            {hasAccess("/orders") && (
                <button
                    onClick={() => navigate("/orders")}
                    className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-full border transition-all cursor-pointer ${isActive("/orders")}`}
                >
                    <MdOutlineReorder size={14} />
                    <span className="text-[10px]">Orders</span>
                </button>
            )}

            {/* 3. Center Dish Button Placeholder */}
            {hasAccess("/menu") && (
                <div className="relative w-14 h-14 flex items-center justify-center">
                    <button
                        disabled={location.pathname === "/tables" || location.pathname === "/menu"}
                        onClick={openModal}
                        className={`absolute -top-4 rounded-full p-3 border transition-all ${(location.pathname === "/tables" || location.pathname === "/menu")
                            ? "bg-[#2d2d2d] text-[#666666] border-[#3d3d3d]/20 shadow-none cursor-not-allowed"
                            : "bg-[#f6b100] text-[#f5f5f5] border-[#f6b100] shadow-lg shadow-[#f6b100]/20 hover:scale-105 active:scale-95 cursor-pointer"
                            }`}
                    >
                        <BiSolidDish size={18} />
                    </button>
                    <CreateOrderModal isOpen={isModalOpen} onClose={closeModal} />
                </div>
            )}

            {/* 4. Tables */}
            {hasAccess("/tables") && (
                <button
                    onClick={() => navigate("/tables")}
                    className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-full border transition-all cursor-pointer ${isActive("/tables")}`}
                >
                    <MdTableBar size={14} />
                    <span className="text-[10px]">Tables</span>
                </button>
            )}

            {/* 5. Role-specific More/Staff button */}
            {hasAccess("/staff") && (
                <button
                    onClick={() => navigate("/staff")}
                    className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-full border transition-all cursor-pointer ${isActive("/staff")}`}
                >
                    <FaUsers size={14} />
                    <span className="text-[10px]">{user.role === "Super Admin" ? "Users" : "Staff"}</span>
                </button>
            )}

            {/* 6. Settings for Restaurant Admin (Fallback when not showing Staff on Mobile) */}
            {user.role === "Restaurant Admin" && !hasAccess("/staff") && hasAccess("/settings") && (
                <button
                    onClick={() => navigate("/settings")}
                    className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-full border transition-all cursor-pointer ${isActive("/settings")}`}
                >
                    <FaCog size={14} />
                    <span className="text-[10px]">Settings</span>
                </button>
            )}
        </div>
    );
};

export default BottomNav;
