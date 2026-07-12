import React from "react";
import { FaChartBar, FaFileDownload, FaArrowUp, FaArrowDown, FaCalendarAlt } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";

const MOCK_REPORTS = [
  { id: "REP-01", name: "Daily Sales Summary (July 12)", date: "2026-07-12", size: "142 KB", type: "PDF" },
  { id: "REP-02", name: "Weekly Performance Metrics", date: "2026-07-06", size: "1.2 MB", type: "CSV" },
  { id: "REP-03", name: "Waiter Efficiency & Order Turnaround", date: "2026-06-30", size: "480 KB", type: "PDF" },
  { id: "REP-04", name: "Menu Item Popularity Index", date: "2026-06-30", size: "820 KB", type: "CSV" },
  { id: "REP-05", name: "Monthly Tax & Auditing Report", date: "2026-06-30", size: "2.4 MB", type: "PDF" }
];

const Reports = () => {
  const handleDownload = (name) => {
    toast.success(`Downloaded: ${name}`);
  };

  const metrics = [
    { title: "Net Sales Today", value: "₹42,850", change: "+14.2%", positive: true, note: "vs yesterday" },
    { title: "Average Ticket Size", value: "₹1,240", change: "-2.1%", positive: false, note: "vs last week" },
    { title: "Billed Orders Today", value: "34", change: "+6.8%", positive: true, note: "vs yesterday" },
    { title: "Kitchen Prep Time", value: "14.2 min", change: "-8.4%", positive: true, note: "shorter is better" }
  ];

  return (
    <div className="p-6 bg-[#1f1f1f] min-h-[calc(100vh-4rem)] text-[#f5f5f5] space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FaChartBar className="text-yellow-400" /> Analytical Reports
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Track business growth, hourly sales metrics, audit logs, and employee performance statistics.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-[#181818] border border-white/5 px-3 py-1.5 rounded-xl text-xs text-gray-300 font-semibold cursor-pointer">
          <FaCalendarAlt className="text-yellow-400" />
          <span>Last 30 Days</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <Card key={idx} className="bg-[#181818] border-white/5 p-4 flex flex-col justify-between">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{m.title}</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-extrabold text-white">{m.value}</span>
              <span className={`text-[10px] font-bold flex items-center gap-0.5 ${m.positive ? "text-emerald-400" : "text-red-400"}`}>
                {m.positive ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
                {m.change}
              </span>
            </div>
            <span className="text-[9px] text-gray-500 font-medium mt-1">{m.note}</span>
          </Card>
        ))}
      </div>

      {/* Reports Listing Table */}
      <Card className="bg-[#181818] border-white/5 overflow-hidden">
        <CardHeader className="border-b border-white/5 py-4 px-6">
          <CardTitle className="text-sm font-semibold text-gray-300">
            Available Reports & Audits
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-black/10">
                  <th className="py-3 px-6">Report Name</th>
                  <th className="py-3 px-6">Date Created</th>
                  <th className="py-3 px-6">File Details</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_REPORTS.map((rep) => (
                  <tr key={rep.id} className="hover:bg-white/[0.02] transition-colors text-xs text-gray-300">
                    <td className="py-4 px-6 font-semibold text-white">
                      {rep.name}
                    </td>
                    <td className="py-4 px-6 text-gray-400 font-medium">
                      {rep.date}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-400 font-medium">{rep.size}</span>
                      <span className="text-[10px] bg-[#262626] border border-white/10 px-1.5 py-0.5 rounded font-mono font-bold text-yellow-400 ml-2">
                        {rep.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDownload(rep.name)}
                        className="bg-yellow-400 hover:bg-yellow-300 text-gray-950 px-3 py-1.5 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                      >
                        <FaFileDownload size={10} />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
