import React, { useState, useEffect, useRef } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaNotesMedical } from "react-icons/fa6";
import { MdOutlineFastfood } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { removeItemFromCart, updateItemNote } from "../../redux/slices/cartSlice";

const CartInfo = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);
    const sessionItems = useSelector((state) => state.cart.sessionItems || []);
    const [editingNoteId, setEditingNoteId] = useState(null);
    const scrollContainerRef = useRef(null);
    const prevCartLengthRef = useRef(cartItems.length);

    useEffect(() => {
        if (cartItems.length > prevCartLengthRef.current) {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo({
                    top: scrollContainerRef.current.scrollHeight,
                    behavior: "smooth",
                });
            }
        }
        prevCartLengthRef.current = cartItems.length;
    }, [cartItems.length]);

    const toggleNoteEditor = (key) => {
        setEditingNoteId(editingNoteId === key ? null : key);
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 px-6 py-4">
            <h1 className="text-base text-[#e4e4e4] font-semibold tracking-wide shrink-0">
                Order Details
            </h1>
            
            {cartItems.length === 0 && sessionItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 px-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#2d2d2d]/30 border border-[#3d3d3d]/50 flex items-center justify-center mb-4">
                        <MdOutlineFastfood className="text-[#666666] text-3xl" />
                    </div>
                    <h2 className="text-[#f5f5f5] text-sm font-semibold tracking-wide">Your cart is empty</h2>
                    <p className="text-[#ababab] text-xs mt-1 max-w-[200px] leading-relaxed">
                        Add items from the menu to build the order details.
                    </p>
                </div>
            ) : (
                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto scrollbar-hide mt-4 space-y-4 pr-1">
                    
                    {/* Placed Session Orders Section */}
                    {sessionItems.length > 0 && (
                        <div className="space-y-2">
                            <h2 className="text-[10px] font-bold text-[#ababab] uppercase tracking-wider mb-2 select-none">Ordered Items</h2>
                            {sessionItems.map((item, idx) => {
                                const statusLower = item.status?.toLowerCase();
                                const isReady = statusLower === "ready";
                                const isServed = statusLower === "served";
                                const isCompleted = statusLower === "completed";

                                return (
                                    <div 
                                        key={`session-${item.id}-${idx}`} 
                                        className="bg-[#1e1e1e]/60 border border-[#2d2d2d]/30 rounded-xl p-3 flex flex-col gap-1.5"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="min-w-0 flex-1 pr-2">
                                                <h1 className="text-[#e4e4e4] font-semibold text-xs truncate" title={item.name}>{item.name}</h1>
                                                {item.notes && (
                                                    <p className="text-[9px] text-[#f6b100]/80 italic mt-0.5">* {item.notes}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[#ababab] text-xs font-bold">x{item.quantity}</span>
                                                <span className="text-[#ababab] text-xs font-bold w-12 text-right">₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            {isReady && (
                                                <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 uppercase tracking-wider select-none">Ready</span>
                                            )}
                                            {isServed && (
                                                <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider select-none">Served</span>
                                            )}
                                            {isCompleted && (
                                                <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wider select-none">Paid</span>
                                            )}
                                            {!isReady && !isServed && !isCompleted && (
                                                <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-wider select-none animate-pulse">Preparing</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* New Draft Items Section */}
                    {cartItems.length > 0 && (
                        <div className="space-y-2">
                            <h2 className="text-[10px] font-bold text-[#f6b100] uppercase tracking-wider mb-2 select-none">New Items (Draft)</h2>
                            {cartItems.map((item) => {
                                const itemKey = `${item.menuId}-${item.id}`;
                                const isEditingNote = editingNoteId === itemKey;

                                return (
                                    <div 
                                        key={itemKey} 
                                        className="bg-[#1a1a1a] border border-[#f6b100]/20 rounded-xl p-4 transition-all duration-200 hover:bg-[#222222]/80"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="min-w-0 flex-1 pr-2">
                                                <h1 className="text-[#f5f5f5] font-semibold tracking-wide text-sm truncate" title={item.name}>
                                                    {item.name}
                                                </h1>
                                                {item.notes && !isEditingNote && (
                                                    <p className="text-[10px] text-[#f6b100] mt-0.5 italic font-medium leading-tight">
                                                        * {item.notes}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="text-[#ababab] text-sm font-semibold shrink-0">x{item.quantity}</p>
                                        </div>
                                        
                                        {isEditingNote && (
                                            <div className="mt-3">
                                                <input
                                                    type="text"
                                                    placeholder="E.g., extra spicy, no onions..."
                                                    value={item.notes}
                                                    onChange={(e) => dispatch(updateItemNote({ itemId: item.id, menuId: item.menuId, notes: e.target.value }))}
                                                    className="w-full bg-[#111111] border border-[#2d2d2d] rounded-lg text-xs p-2 text-[#f5f5f5] focus:outline-none focus:border-[#f6b100]/50 font-medium"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" || e.key === "Escape") {
                                                            setEditingNoteId(null);
                                                        }
                                                    }}
                                                    autoFocus
                                                />
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    onClick={() => dispatch(removeItemFromCart({ itemId: item.id, menuId: item.menuId }))}
                                                    className="text-[#ababab] hover:text-red-500 transition-colors duration-200 cursor-pointer"
                                                    title="Remove item"
                                                >
                                                    <RiDeleteBin2Fill size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => toggleNoteEditor(itemKey)}
                                                    className={`transition-colors duration-200 cursor-pointer ${
                                                        isEditingNote || item.notes 
                                                            ? 'text-[#f6b100] hover:text-[#f6b100]/80' 
                                                            : 'text-[#ababab] hover:text-[#f6b100]'
                                                    }`}
                                                    title="Add special instructions"
                                                >
                                                    <FaNotesMedical size={16} />
                                                </button>
                                            </div>
                                            <p className="text-[#f5f5f5] text-sm font-bold">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CartInfo;