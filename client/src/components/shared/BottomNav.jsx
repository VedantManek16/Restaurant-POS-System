import { FaHome } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar } from "react-icons/md";
import { CiCircleMore } from 'react-icons/ci';
import { BiSolidDish } from 'react-icons/bi';
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import CreateOrderModal from "./CreateOrderModal";

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => setIsModalOpen(false);
    const openModal = () => setIsModalOpen(true);

    const isActive = (path) => {
        return location.pathname === path
            ? "text-[#f5f5f5] bg-[#2d2d2d] hover:bg-[#343434] border-[#3d3d3d]/20 font-semibold"
            : "text-[#ababab] hover:text-[#f5f5f5] bg-transparent border-transparent font-medium";
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1e1e1e] border-t border-[#2d2d2d]/30 px-6 h-16 flex items-center justify-around z-50">
            {/* 1. Home */}
            <button
                onClick={() => navigate("/")}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full border transition-all cursor-pointer ${isActive("/")}`}
            >
                <FaHome size={16} />
                <span className="text-xs">Home</span>
            </button>

            {/* 2. Orders */}
            <button
                onClick={() => navigate("/orders")}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full border transition-all cursor-pointer ${isActive("/orders")}`}
            >
                <MdOutlineReorder size={16} />
                <span className="text-xs">Orders</span>
            </button>

            {/* 3. Center Dish Button Placeholder */}
            <div className="relative w-16 h-16 flex items-center justify-center">
                <button
                    disabled={location.pathname === "/tables" || location.pathname === "/menu"}
                    onClick={openModal}
                    className={`absolute -top-5 rounded-full p-3.5 border transition-all ${(location.pathname === "/tables" || location.pathname === "/menu")
                        ? "bg-[#2d2d2d] text-[#666666] border-[#3d3d3d]/20 shadow-none cursor-not-allowed"
                        : "bg-[#f6b100] text-[#f5f5f5] border-[#f6b100] shadow-lg shadow-[#f6b100]/20 hover:scale-105 active:scale-95 cursor-pointer"
                        }`}
                >
                    <BiSolidDish size={22} />
                </button>
                <CreateOrderModal isOpen={isModalOpen} onClose={closeModal} />
            </div>

            {/* 4. Tables */}
            <button
                onClick={() => navigate("/tables")}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full border transition-all cursor-pointer ${isActive("/tables")}`}
            >
                <MdTableBar size={16} />
                <span className="text-xs">Tables</span>
            </button>

            {/* 5. More */}
            <button
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full border transition-all cursor-pointer ${isActive("/more")}`}
            >
                <CiCircleMore size={16} />
                <span className="text-xs">More</span>
            </button>
        </div>
    );
};

export default BottomNav;
