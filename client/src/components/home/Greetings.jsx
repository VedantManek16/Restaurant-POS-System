import React from "react";
import Timer from "./Timer";

const Greetings = () => {
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
                <h1 className="text-[#f5f5f5] text-xl font-semibold tracking-wide">
                    {getGreeting()}, Vedant
                </h1>
                <p className="text-[#ababab] text-xs mt-0.5">Give your best services for customers 😊</p>
            </div>
            <Timer />
        </div>
    );
}
export default Greetings;