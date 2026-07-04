import { useState, useEffect } from "react";
const Greetings = () => {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    // runs on first render & cleans up on unmount

    const formatDate = (date) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`
    }
    const formatTime = (date) =>
        `${String(date.getHours()).padStart(2, "0")}:${String(
            date.getMinutes()
        ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

    return (
        <div className="flex justify-between items-center px-8 mt-4">
            <div>
                <h1 className="text-[#f5f5f5] text-xl font-semibold tracking-wide">Good Morning, Vedant</h1>
                <p className="text-[#ababab] text-xs mt-0.5">Give your best services for customers 😊</p>
            </div>
            <div className="text-right">
                <h1 className="text-[#f5f5f5] text-2xl font-semibold tracking-wide">{formatTime(dateTime)}</h1>
                <p className="text-[#ababab] text-xs mt-0.5">{formatDate(dateTime)}</p>
            </div>
        </div>
    );
}
export default Greetings