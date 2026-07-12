const MiniCard = ({ title, icon, number, footerNum, trend = "up" }) => {
    const isCurrency = 
        title === "Total Earnings" || 
        title === "Platform MRR" || 
        title === "Monthly Revenue (MRR)" || 
        title === "Monthly Revenue" ||
        title === "SaaS Monthly Revenue";
    
    let displayValue = number;
    if (typeof number === "number") {
        if (isCurrency) {
            displayValue = `₹${number.toLocaleString("en-IN")}`;
        } else {
            displayValue = number.toLocaleString("en-IN");
        }
    }

    const isPositive = trend === "up";
    const trendArrow = isPositive ? "↑" : "↓";
    const trendColor = isPositive ? "text-emerald-400 font-bold" : "text-rose-400 font-bold";

    return (
        <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[135px] w-full transition-all duration-300 hover:border-yellow-400/20 hover:shadow-xl hover:shadow-black/25">
            <div className="flex items-start justify-between">
                <h1 className="text-[#ababab] text-xs font-semibold uppercase tracking-wider">{title}</h1>
                <div className={`p-2.5 rounded-xl text-[#f5f5f5] text-lg bg-[#262626] border border-white/5 flex items-center justify-center shrink-0`}>
                    {icon}
                </div>
            </div>
            <div className="mt-4">
                <p className="text-3xl font-black text-white tracking-tight leading-none">
                    {displayValue}
                </p>
                <p className="text-gray-500 text-[11px] mt-2 font-medium flex items-center gap-1">
                    <span className={trendColor}>{trendArrow} {footerNum}%</span>
                    <span>vs last month</span>
                </p>
            </div>
        </div>
    );
};

export default MiniCard;