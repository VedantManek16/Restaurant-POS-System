import { FaHome } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar } from "react-icons/md";
import { CiCircleMore } from 'react-icons/ci';
import { BiSolidDish } from 'react-icons/bi';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CreateOrderModal from "./CreateOrderModal";

const BottomNav = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const closeModal = () => setIsModalOpen(false)
    const openModal = () => setIsModalOpen(true);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1e1e1e] border-t border-[#2d2d2d]/30 px-6 h-16 flex items-center justify-around z-50">
            {/* 1. Home */}
            <button onClick={() => navigate("/")} className="flex items-center justify-center gap-2 text-[#f5f5f5] bg-[#2d2d2d] hover:bg-[#343434] px-4 py-2 rounded-full border border-[#3d3d3d]/20 transition-all cursor-pointer">
                <FaHome size={16} />
                <span className="text-xs font-semibold">Home</span>
            </button>

            {/* 2. Orders */}
            <button onClick={() => navigate("/orders")} className="flex items-center justify-center gap-2 text-[#ababab] hover:text-[#f5f5f5] px-4 py-2 rounded-full transition-all cursor-pointer">
                <MdOutlineReorder size={16} />
                <span className="text-xs font-medium">Orders</span>
            </button>

            {/* 3. Center Dish Button Placeholder */}
            <div className="relative w-16 h-16 flex items-center justify-center">
                <button onClick={openModal} className="absolute -top-5 bg-[#f6b100] text-[#f5f5f5] rounded-full p-3.5 shadow-lg shadow-[#f6b100]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#f6b100]">
                    <BiSolidDish size={22} className="text-[#f5f5f5]" />
                </button>
                <CreateOrderModal isOpen={isModalOpen} onClose={closeModal} />
            </div>

            {/* 4. Tables */}
            <button onClick={() => navigate("/tables")} className="flex items-center justify-center gap-2 text-[#ababab] hover:text-[#f5f5f5] px-4 py-2 rounded-full transition-all cursor-pointer">
                <MdTableBar size={16} />
                <span className="text-xs font-medium">Tables</span>
            </button>

            {/* 5. More */}
            <button className="flex items-center justify-center gap-2 text-[#ababab] hover:text-[#f5f5f5] px-4 py-2 rounded-full transition-all cursor-pointer">
                <CiCircleMore size={16} />
                <span className="text-xs font-medium">More</span>
            </button>
        </div>
    )
}

export default BottomNav;