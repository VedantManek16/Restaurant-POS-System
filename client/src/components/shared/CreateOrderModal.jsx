import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { PhoneInput } from "@/components/ui/phone-input";

const CreateOrderModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [guestCount, setGuestCount] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState("");

    const increment = () => {
        if (guestCount >= 6) return;
        setGuestCount((prev) => prev + 1);
    };

    const decrement = () => {
        if (guestCount <= 0) return;
        setGuestCount((prev) => prev - 1);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Order">
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-[11px] font-semibold text-[#ababab] uppercase tracking-wider mb-2">Customer Name</label>
                    <div className="flex items-center rounded-xl p-3 bg-[#141414] border border-[#2d2d2d]/80 focus-within:border-[#f6b100]/50 transition-colors">
                        <input
                            type="text"
                            placeholder="Enter customer name"
                            className="bg-transparent flex-1 text-xs! text-[#f5f5f5] placeholder:text-xs! placeholder-[#555] focus:outline-none w-full"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[11px] font-semibold text-[#ababab] uppercase tracking-wider mb-2">Customer Phone</label>
                    <PhoneInput
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        defaultCountry="IN"
                        placeholder="Enter phone number"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-semibold text-[#ababab] uppercase tracking-wider mb-2">Guest</label>
                    <div className="flex items-center justify-between bg-[#141414] border border-[#2d2d2d]/80 px-4 py-2.5 rounded-xl">
                        <button onClick={decrement} className="text-xl font-bold text-[#f6b100] hover:text-yellow-400 transition-colors cursor-pointer select-none">&minus;</button>
                        <span className="text-xs font-semibold text-[#f5f5f5]">{guestCount} Person</span>
                        <button onClick={increment} className="text-xl font-bold text-[#f6b100] hover:text-yellow-400 transition-colors cursor-pointer select-none">&#43;</button>
                    </div>
                </div>
                <button
                    onClick={() => {
                        onClose();
                        navigate("/tables");
                    }}
                    className="w-full mt-4 bg-[#f6b100] text-[#1a1a1a] py-3 rounded-xl hover:bg-[#e0a100] active:scale-[0.98] transition-all font-bold text-xs tracking-wider uppercase cursor-pointer"
                >
                    Create Order
                </button>
            </div>
        </Modal>
    );
};

export default CreateOrderModal;
