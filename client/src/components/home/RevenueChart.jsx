import { useState } from "react";

const RevenueChart = ({ hourlySales = [], dailyStastistics = [] }) => {
  const [chartType, setChartType] = useState("daily"); // "daily" or "hourly"
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // 1. Prepare Daily Data (Last 7 days)
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const match = dailyStastistics?.find(s => s._id === dateStr);
    const label = d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
    return {
      label,
      val: match ? match.sales : 0
    };
  });

  // 2. Prepare Hourly Data (8 AM to 10 PM)
  const hours = Array.from({ length: 15 }, (_, i) => i + 8);
  const hourlyData = hours.map(hr => {
    const match = hourlySales?.find(s => s._id === hr);
    const ampm = hr >= 12 ? "PM" : "AM";
    const displayHour = hr > 12 ? hr - 12 : hr;
    return {
      label: `${displayHour}:00 ${ampm}`,
      val: match ? match.sales : 0
    };
  });

  const data = chartType === "daily" ? dailyData : hourlyData;

  // SVG dimensions
  const W = 600;
  const H = 200;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const maxVal = Math.max(...data.map(d => d.val), 500); // minimum scale peak at 500

  // Coordinates calculators
  const getX = (index) => {
    return paddingLeft + index * (W - paddingLeft - paddingRight) / (data.length - 1);
  };

  const getY = (val) => {
    return paddingTop + (H - paddingTop - paddingBottom) * (1 - val / maxVal);
  };

  // Generate SVG Path
  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.val)}`).join(" ");
  const areaPath = data.length > 0 
    ? `${linePath} L ${getX(data.length - 1)} ${H - paddingBottom} L ${getX(0)} ${H - paddingBottom} Z`
    : "";

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6 mx-8 mt-5 relative transition-all duration-300 hover:border-white/10">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-sm font-bold text-white">Revenue Analytics</h2>
          <p className="text-[10px] text-gray-500">Track and visualize hourly or daily restaurant earnings.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#262626] border border-white/5 rounded-xl p-1">
          <button
            onClick={() => { setChartType("daily"); setHoveredIndex(null); }}
            className={`text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              chartType === "daily" 
                ? "bg-yellow-400 text-gray-950" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Daily (7D)
          </button>
          <button
            onClick={() => { setChartType("hourly"); setHoveredIndex(null); }}
            className={`text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              chartType === "hourly" 
                ? "bg-yellow-400 text-gray-950" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Hourly (Today)
          </button>
        </div>
      </div>

      <div className="w-full relative h-[200px]">
        {/* Hover Dotted Vertical Guideline & Tooltip overlay */}
        {hoveredIndex !== null && (
          <>
            {/* Tooltip */}
            <div
              className="absolute bg-[#262626] border border-white/10 px-3 py-1.5 rounded-xl shadow-xl pointer-events-none text-xs font-bold text-white z-20 flex flex-col items-start min-w-[80px] animate-in fade-in duration-100"
              style={{
                left: `${Math.min(getX(hoveredIndex) - 40, W - 110)}px`,
                top: `${Math.max(getY(data[hoveredIndex].val) - 45, 0)}px`
              }}
            >
              <span className="text-[9px] text-gray-500 font-semibold">{data[hoveredIndex].label}</span>
              <span className="text-emerald-400 mt-0.5">₹{data[hoveredIndex].val.toFixed(2)}</span>
            </div>
          </>
        )}

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full overflow-visible">
          <defs>
            {/* Gradient fill definition */}
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {Array.from({ length: 4 }).map((_, idx) => {
            const val = (maxVal / 3) * idx;
            const y = getY(val);
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={W - paddingRight}
                  y2={y}
                  stroke="#ffffff"
                  strokeOpacity={0.03}
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#777"
                  className="text-[9px] font-semibold font-mono"
                >
                  ₹{Math.round(val)}
                </text>
              </g>
            );
          })}

          {/* Dotted hover bar */}
          {hoveredIndex !== null && (
            <line
              x1={getX(hoveredIndex)}
              y1={paddingTop}
              x2={getX(hoveredIndex)}
              y2={H - paddingBottom}
              stroke="#10b981"
              strokeDasharray="3 3"
              strokeOpacity={0.3}
              strokeWidth={1.5}
            />
          )}

          {/* Smooth area gradient */}
          {data.length > 0 && (
            <path d={areaPath} fill="url(#chartGradient)" />
          )}

          {/* Main Line path */}
          {data.length > 0 && (
            <path
              d={linePath}
              fill="none"
              stroke="#10b981"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Nodes (Dots) */}
          {data.map((d, i) => {
            const x = getX(i);
            const y = getY(d.val);
            const isHovered = hoveredIndex === i;
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 4.5 : 2.5}
                  fill={isHovered ? "#10b981" : "#1a1a1a"}
                  stroke="#10b981"
                  strokeWidth={2}
                  className="transition-all duration-150"
                />
              </g>
            );
          })}

          {/* X Axis labels */}
          {data.map((d, i) => {
            // Decimate labels for hourly (only show every other label to prevent overlap)
            const showLabel = chartType === "daily" || i % 2 === 0;
            if (!showLabel) return null;
            return (
              <text
                key={i}
                x={getX(i)}
                y={H - paddingBottom + 15}
                textAnchor="middle"
                fill="#777"
                className="text-[8px] font-bold tracking-wider"
              >
                {d.label}
              </text>
            );
          })}
        </svg>

        {/* Hover zones (invisible vertical bars to capture mouse hovers reliably) */}
        {data.map((d, i) => {
          const colWidth = (W - paddingLeft - paddingRight) / (data.length - 1);
          return (
            <div
              key={i}
              className="absolute top-0 bottom-0 cursor-pointer"
              style={{
                left: `${getX(i) - colWidth / 2}px`,
                width: `${colWidth}px`,
                height: `${H - paddingBottom}px`
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RevenueChart;
