import React, { useState, useEffect } from "react";
import { formatDate, formatTime } from "../../utils/dateFormatter";

const Timer = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-right select-none">
      <h1 className="text-[#f5f5f5] text-2xl font-semibold tracking-wide">{formatTime(dateTime)}</h1>
      <p className="text-[#ababab] text-xs mt-0.5">{formatDate(dateTime)}</p>
    </div>
  );
};

export default Timer;
