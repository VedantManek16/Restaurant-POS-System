import React from "react";
import Timer from "./Timer";
import { useSelector } from "react-redux";

const Greetings = () => {
    const { user } = useSelector((state) => state.user);

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
        <div className="flex justify-between items-center px-8 mt-4">
            <div>
                {user?.role === "Super Admin" ? (
                    <>
                        <h1 className="text-[#f5f5f5] text-xl font-bold tracking-wide">
                            RestroDesk Platform Dashboard
                        </h1>
                        <p className="text-[#ababab] text-xs mt-0.5">Welcome back, {firstName} | Central SaaS Administrator</p>
                    </>
                ) : (
                    <>
                        <h1 className="text-white text-2xl font-black tracking-tight">
                            {user?.tenantName || "Taste Hub"}
                        </h1>
                        <p className="text-[#f6b100] text-xs font-bold uppercase tracking-wider mt-0.5">
                            {user?.role} Dashboard <span className="text-gray-500 font-normal lowercase">| Welcome, {firstName}</span>
                        </p>
                    </>
                )}
            </div>
            <Timer />
        </div>
    );
}
export default Greetings;