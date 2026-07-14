import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { formatDate, formatTime12Hr } from "../../utils/dateFormatter";

const Greetings = ({ showDropdown, timeRange, setTimeRange, onRefresh }) => {
    const { user } = useSelector((state) => state.user);
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Extract first name
    const firstName = user?.name ? user.name.split(" ")[0] : "Employee";

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "Good Morning";
        if (hour >= 12 && hour < 17) return "Good Afternoon";
        if (hour >= 17 && hour < 22) return "Good Evening";
        return "Good Night";
    };

    return (
        <div className="flex justify-between items-center px-8 mt-4 shrink-0">
            <div>
                {user?.role === "Super Admin" ? (
                    <>
                        <h1 className="text-[#f5f5f5] text-xl font-bold tracking-wide">
                            RestroDesk Platform Dashboard
                        </h1>
                        <p className="text-[#ababab] text-xs mt-0.5">Welcome back, {firstName} | Central SaaS Administrator &middot; {formatDate(dateTime)}</p>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-1.5">
                            <h1 className="text-white text-2xl font-black tracking-tight">
                                {getGreeting()}, {firstName}
                            </h1>
                            {user?.role && (
                                <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ml-1.5 select-none">
                                    {user.role}
                                </span>
                            )}
                        </div>
                        <p className="text-[#f6b100] text-xs font-bold uppercase tracking-wider mt-0.5">
                            {user?.tenantName || "Taste Hub"} &middot; <span className="text-[#ababab] font-normal lowercase">{formatDate(dateTime)}</span>
                        </p>
                    </>
                )}
            </div>

            {showDropdown ? (
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-[#1a1a1a] border border-[#2d2d2d]/60 text-[#f5f5f5] text-xs font-semibold px-4 py-2 rounded-xl focus:outline-none cursor-pointer appearance-none pr-9 hover:bg-[#222] transition-colors"
                            style={{
                                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ababab' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                backgroundPosition: 'right 0.6rem center',
                                backgroundSize: '1rem 1rem',
                                backgroundRepeat: 'no-repeat'
                            }}
                        >
                            <option value="7" className="bg-[#1a1a1a]">Last 7 days</option>
                            <option value="30" className="bg-[#1a1a1a]">Last 30 days</option>
                            <option value="90" className="bg-[#1a1a1a]">Last 90 days</option>
                        </select>
                    </div>

                    <button
                        onClick={onRefresh}
                        className="bg-[#1a1a1a] border border-[#2d2d2d]/60 hover:bg-[#262626] text-[#ababab] hover:text-[#f5f5f5] text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer select-none active:scale-[0.97]"
                    >
                        Refresh
                    </button>
                </div>
            ) : (
                <div className="text-right select-none">
                    <h1 className="text-[#f5f5f5] text-2xl font-semibold tracking-wide">
                        {formatTime12Hr(dateTime)}
                    </h1>
                    <p className="text-[#ababab] text-xs mt-0.5">
                        {formatDate(dateTime)}
                    </p>
                </div>
            )}
        </div>
    );
}

export default Greetings;
