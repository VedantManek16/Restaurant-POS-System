import { useState, useEffect } from "react";
import { FaChartBar, FaFileDownload, FaArrowUp, FaArrowDown, FaCalendarAlt } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { apiRequest } from "../utils/api";

const REPORTS_LIST = [
  { id: "REP-01", name: "Daily Sales Summary", type: "daily-sales", description: "All completed transactions and payment modes for today.", format: "CSV" },
  { id: "REP-02", name: "Weekly Performance Metrics", type: "weekly-performance", description: "Consolidated sales totals and volumes grouped weekly.", format: "CSV" },
  { id: "REP-03", name: "Monthly Tax & Auditing Report", type: "monthly-tax", description: "Audit logs of tax collected, rates, and subtotals for this month.", format: "CSV" }
];

const Reports = () => {
  const [stats, setStats] = useState({
    sales: 0,
    count: 0,
    avgTicket: 0
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiRequest("/reports/analytics");
        if (res.success && res.data && res.data.today) {
          setStats(res.data.today);
        }
      } catch (error) {
        console.error("Error loading analytics:", error);
      }
    };
    fetchAnalytics();
  }, []);

  const handleDownload = async (reportType, reportName) => {
    const loadId = toast.loading("Generating CSV report...");
    try {
      const res = await apiRequest(`/reports/data/${reportType}`);
      
      if (!res.success || !res.data || res.data.length === 0) {
        toast.error("No record data found for this report period.", { id: loadId });
        return;
      }

      const jsonArr = res.data;
      const headers = Object.keys(jsonArr[0]);
      
      const csvRows = [];
      csvRows.push(headers.join(",")); // Header row

      for (const row of jsonArr) {
        const values = headers.map(header => {
          const val = row[header];
          const escaped = ("" + (val !== undefined && val !== null ? val : "")).replace(/"/g, '""');
          return escaped.includes(",") || escaped.includes("\n") ? `"${escaped}"` : escaped;
        });
        csvRows.push(values.join(","));
      }

      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${reportName.replace(/\s+/g, "_")}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("CSV Report downloaded successfully!", { id: loadId });

    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error(error.message || "Failed to generate report.", { id: loadId });
    }
  };

  const metrics = [
    { title: "Net Sales Today", value: `₹${stats.sales.toFixed(2)}`, change: "+10.0%", positive: true, note: "live figures" },
    { title: "Average Ticket Size", value: `₹${stats.avgTicket.toFixed(2)}`, change: "+5.0%", positive: true, note: "live average" },
    { title: "Billed Orders Today", value: stats.count.toString(), change: "+12.0%", positive: true, note: "live counter" }
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
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
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
                  <th className="py-3 px-6">Description</th>
                  <th className="py-3 px-6">File Type</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {REPORTS_LIST.map((rep) => (
                  <tr key={rep.id} className="hover:bg-white/[0.02] transition-colors text-xs text-gray-300">
                    <td className="py-4 px-6 font-semibold text-white">
                      {rep.name}
                    </td>
                    <td className="py-4 px-6 text-gray-400 font-medium max-w-xs truncate">
                      {rep.description}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] bg-[#262626] border border-white/10 px-2 py-0.5 rounded font-mono font-bold text-yellow-400">
                        {rep.format}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDownload(rep.type, rep.name)}
                        className="bg-yellow-400 hover:bg-yellow-300 text-gray-950 px-3 py-1.5 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                      >
                        <FaFileDownload size={10} />
                        Download CSV
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
