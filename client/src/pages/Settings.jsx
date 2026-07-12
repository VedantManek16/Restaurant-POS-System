import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaCog, FaStore, FaTools, FaBell, FaReceipt, FaLock } from "react-icons/fa";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const Settings = () => {
  const { user } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("outlet");

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Settings saved successfully.");
  };

  const tabs = [
    { id: "outlet", label: "Outlet Settings", icon: FaStore },
    { id: "billing", label: "Billing & Receipts", icon: FaReceipt },
    { id: "notifications", label: "Alerts & Kitchen", icon: FaBell },
    { id: "advanced", label: "Security & Keys", icon: FaLock }
  ];

  return (
    <div className="p-6 bg-[#1f1f1f] min-h-[calc(100vh-4rem)] text-[#f5f5f5] space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <FaCog className="text-yellow-400" /> Restaurant Settings
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Configure branding, tax rules, invoice receipts, kitchen routing, and operational schedules.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side: Tabs Selector */}
        <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap lg:w-full ${
                  isActive
                    ? "bg-yellow-400/10 border-yellow-400 text-yellow-400"
                    : "bg-[#181818] border-white/5 text-gray-400 hover:text-gray-200"
                }`}
              >
                <TabIcon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Side: Tab Form panel */}
        <div className="flex-1">
          <Card className="bg-[#181818] border-white/5 p-6 text-gray-300">
            {activeTab === "outlet" && (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Outlet Information</h3>
                  <p className="text-[10px] text-gray-500 mb-4">Edit the default store details displayed on customer bills.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Restaurant Name</label>
                    <input
                      type="text"
                      defaultValue="Taste Hub Restaurant"
                      className="w-full bg-[#262626] border border-white/5 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Active Outlet ID / Tenant</label>
                    <input
                      type="text"
                      disabled
                      value={user?.tenant || "Restro Main (Downtown)"}
                      className="w-full bg-[#262626] border border-white/5 rounded-xl px-4 py-2 text-xs text-gray-500 font-semibold cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Store Email</label>
                    <input
                      type="email"
                      defaultValue="contact@tastehub.com"
                      className="w-full bg-[#262626] border border-white/5 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Store Phone</label>
                    <input
                      type="text"
                      defaultValue="+91 98765 43210"
                      className="w-full bg-[#262626] border border-white/5 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Store Address</label>
                  <textarea
                    defaultValue="G-12, Food Circle Mall, Downtown City Centre, 400001"
                    rows="3"
                    className="w-full bg-[#262626] border border-white/5 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold text-xs px-6 py-2 rounded-xl cursor-pointer">
                    Save Changes
                  </Button>
                </div>
              </form>
            )}

            {activeTab === "billing" && (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Billing Configurations</h3>
                  <p className="text-[10px] text-gray-500 mb-4">Set store currency, default taxes, service charges, and receipt formats.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Currency Symbol</label>
                    <select className="w-full bg-[#262626] border border-white/5 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none cursor-pointer">
                      <option value="INR">₹ (INR)</option>
                      <option value="USD">$ (USD)</option>
                      <option value="EUR">€ (EUR)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">GST / CGST + SGST (%)</label>
                    <input
                      type="number"
                      defaultValue={18}
                      className="w-full bg-[#262626] border border-white/5 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Default Service Charge (%)</label>
                    <input
                      type="number"
                      defaultValue={5}
                      className="w-full bg-[#262626] border border-white/5 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Receipt Footer Note</label>
                    <input
                      type="text"
                      defaultValue="Thank you for dining with us!"
                      className="w-full bg-[#262626] border border-white/5 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold text-xs px-6 py-2 rounded-xl cursor-pointer">
                    Save Tax Configuration
                  </Button>
                </div>
              </form>
            )}

            {activeTab === "notifications" && (
              <div className="text-center py-8">
                <FaBell className="text-gray-600 text-3xl mx-auto mb-2" />
                <h4 className="text-white text-xs font-bold mb-1">Kitchen & Alert System</h4>
                <p className="text-[10px] text-gray-500 max-w-xs mx-auto">Notifications and sound setups for incoming orders and status updates are managed dynamically. Default: Enabled.</p>
              </div>
            )}

            {activeTab === "advanced" && (
              <div className="text-center py-8">
                <FaTools className="text-gray-600 text-3xl mx-auto mb-2" />
                <h4 className="text-white text-xs font-bold mb-1">Operational API & Security Keys</h4>
                <p className="text-[10px] text-gray-500 max-w-xs mx-auto">OAuth registries, webhooks, and backend client secrets can only be updated with Super Admin credentials.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
