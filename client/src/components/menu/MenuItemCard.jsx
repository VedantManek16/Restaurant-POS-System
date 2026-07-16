import { Plus, Minus } from "lucide-react";
const MenuItemCard = ({ item, quantity, onIncrement, onDecrement }) => {
    const isActive = quantity > 0;

    return (
        <div
            className={`flex flex-col items-start justify-between p-4 rounded-xl h-[150px] transition-all duration-300 bg-[#1a1a1a] hover:bg-[#222222] border ${isActive
                    ? 'border-[#f6b100]/50 shadow-md shadow-[#f6b100]/5'
                    : 'border-[#2d2d2d]/30'
                }`}
        >
            <div className="flex items-start justify-between w-full gap-2">
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <h1 className="text-[#f5f5f5] text-[15px] font-semibold tracking-wide leading-tight truncate" title={item.name}>
                        {item.name}
                    </h1>
                    {(item.category || item.isVeg !== undefined) && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border w-fit flex items-center gap-1.5 ${
                            (item.category === "Vegetarian" || item.isVeg === true)
                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                (item.category === "Vegetarian" || item.isVeg === true)
                                    ? 'bg-green-400 animate-pulse'
                                    : 'bg-red-400'
                            }`} />
                            {(item.category === "Vegetarian" || item.isVeg === true) ? "Vegetarian" : "Non-Vegetarian"}
                        </span>
                    )}
                </div>

                {item.image && (
                    <div className="w-12 h-12 rounded-lg bg-[#252525] border border-white/5 shrink-0 overflow-hidden shadow-inner">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between w-full mt-auto">
                <p className="text-[#f5f5f5] text-xl font-bold tracking-tight">
                    ₹{item.price}
                </p>
                <div className={`flex items-center justify-between bg-[#111111] border ${isActive ? 'border-[#f6b100]' : 'border-[#2d2d2d]/80'
                    } px-2.5 py-1.5 rounded-xl transition-all duration-200 w-[100px] h-[38px] shadow-inner`}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDecrement();
                        }}
                        disabled={!isActive}
                        className={`transition-all duration-200 select-none flex items-center justify-center w-6 h-6 rounded-lg ${isActive
                                ? 'text-[#f6b100] hover:bg-[#f6b100]/10 cursor-pointer active:scale-75'
                                : 'text-[#444444] cursor-not-allowed'
                            }`}
                    >
                        <Minus size={14} strokeWidth={2.5} />
                    </button>
                    <span className={`text-sm font-semibold transition-all select-none ${isActive ? 'text-[#f5f5f5] font-bold scale-105' : 'text-[#666666]'
                        }`}>
                        {quantity}
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onIncrement();
                        }}
                        className="text-[#f6b100] hover:bg-[#f6b100]/10 transition-all duration-200 cursor-pointer active:scale-75 select-none flex items-center justify-center w-6 h-6 rounded-lg"
                    >
                        <Plus size={14} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;
