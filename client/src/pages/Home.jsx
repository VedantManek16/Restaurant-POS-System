import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Greetings from "../components/home/Greetings"
import BottomNav from "../components/shared/BottomNav"
import MiniCard from "../components/home/MiniCard"
import RecentOrders from "../components/home/RecentOrders"
import PopularDishes from "../components/home/PopularDishes"
import RevenueChart from "../components/home/RevenueChart"
import { BsCashCoin } from "react-icons/bs"
import { GrInProgress } from 'react-icons/gr'
import { FaBuilding, FaServer, FaUsers, FaCoins, FaEllipsisV } from "react-icons/fa"
import { useState, useEffect, useRef } from "react"
import { toast } from "react-hot-toast"
import { apiRequest } from "../utils/api"

const MOCK_RESTAURANTS = [
  { id: 1, name: "Taste Hub", owner: "Vedant Manek", plan: "Enterprise", status: "Active", created: "Jan 15, 2026" },
  { id: 2, name: "Pizza World", owner: "Alessandro Rossi", plan: "Professional", status: "Active", created: "Mar 22, 2026" },
  { id: 3, name: "Burger Nation", owner: "Sarah Jenkins", plan: "Basic", status: "Active", created: "May 10, 2026" },
  { id: 4, name: "Cafe Aroma", owner: "Emily Parker", plan: "Professional", status: "Pending Approval", created: "Jul 11, 2026" }
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const isSuperAdmin = user?.role === "Super Admin";
  const isRestaurantAdmin = user?.role === "Restaurant Admin";

  useEffect(() => {
    if (user?.role === "Kitchen Staff") {
      navigate("/orders");
    }
  }, [user, navigate]);

  const [restaurants, setRestaurants] = useState(MOCK_RESTAURANTS);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const dropdownRef = useRef(null);
  const [timeRange, setTimeRange] = useState("7");
  const [isLoading, setIsLoading] = useState(!isSuperAdmin);
  const [analytics, setAnalytics] = useState({
    today: { sales: 0, count: 0, avgTicket: 0, avgPrep: 14.2, inProgress: 0 },
    allTime: { sales: 0, count: 0, avgTicket: 0 }
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await apiRequest("/reports/analytics");
        if (res.success && res.data) {
          setAnalytics(res.data);
        }
      } catch (error) {
        console.error("Error loading home metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (!isSuperAdmin) {
      loadAnalytics();
    }
  }, [isSuperAdmin]);

  const handleRefresh = async () => {
    if (!isSuperAdmin) {
      setIsLoading(true);
      try {
        const res = await apiRequest("/reports/analytics");
        if (res.success && res.data) {
          setAnalytics(res.data);
        }
      } catch (error) {
        console.error("Error loading home metrics:", error);
      } finally {
        setIsLoading(false);
      }
    }
    toast.success("Dashboard metrics refreshed!");
  };

  const getRevenueStats = () => {
    switch (timeRange) {
      case "30":
      case "90":
        return {
          rangeText: "ALL-TIME REVENUE",
          revenue: analytics.allTime.sales,
          ordersCount: analytics.allTime.count,
          avgTransaction: analytics.allTime.avgTicket
        };
      case "7":
      default:
        return {
          rangeText: "TODAY'S REVENUE",
          revenue: analytics.today.sales,
          ordersCount: analytics.today.count,
          avgTransaction: analytics.today.avgTicket
        };
    }
  };

  const stats = getRevenueStats();


  const toggleStatus = (id, name, currentStatus) => {
    const nextStatus = currentStatus === "Active" ? "Suspended" : "Active";
    setRestaurants(restaurants.map(r => r.id === id ? { ...r, status: nextStatus } : r));
    toast.success(`${name} status updated to ${nextStatus}`);
  };

  const approveRestaurant = (id, name) => {
    setRestaurants(restaurants.map(r => r.id === id ? { ...r, status: "Active" } : r));
    toast.success(`Approved registration for ${name}`);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isSuperAdmin) {
    return (
      <section className="bg-[#1f1f1f] min-h-full flex flex-col gap-6 p-6 pb-20 text-gray-300">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Super Admin Dashboard</h1>
            <p className="text-xs text-gray-400 mt-1">Monitor restaurants, subscriptions, users, and overall platform activity.</p>
          </div>
        </div>

        {/* Core SaaS Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MiniCard title="Restaurants" icon={<FaBuilding />} number={restaurants.length} footerNum={10} trend="up" />
          <MiniCard title="Monthly Revenue (MRR)" icon={<FaCoins />} number={145000} footerNum={12.4} trend="up" />
          <MiniCard title="Connected POS Devices" icon={<FaServer />} number={48} footerNum={4.5} trend="up" />
          <MiniCard title="Platform Users" icon={<FaUsers />} number={120} footerNum={8.6} trend="up" />
        </div>

        {/* Registered Restaurants Table */}
        <div className="bg-[#181818] rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-black/10">
            <h2 className="text-sm font-bold text-white">Registered Restaurants</h2>
            <span className="text-[10px] bg-[#262626] border border-white/10 px-2 py-0.5 rounded-full font-bold text-yellow-400">
              {restaurants.length} Active Accounts
            </span>
          </div>

          <div className="overflow-x-auto" ref={dropdownRef}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-black/5">
                  <th className="py-3 px-6">Restaurant Name</th>
                  <th className="py-3 px-6">Restaurant Owner</th>
                  <th className="py-3 px-6">License Plan</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {restaurants.map((res) => (
                  <tr key={res.id} className="hover:bg-white/[0.01] transition-colors text-xs">
                    <td className="py-4 px-6 font-semibold text-white">
                      {res.name}
                      <span className="block text-[10px] text-gray-500 font-normal mt-0.5">Joined: {res.created}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-300 font-medium">{res.owner}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-400 font-bold uppercase">{res.plan}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${res.status === "Active"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : res.status === "Pending Approval"
                            ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400 animate-pulse"
                            : "bg-red-500/10 border-red-500/30 text-red-400"
                        }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right relative">
                      <button
                        onClick={() => setActiveDropdownId(activeDropdownId === res.id ? null : res.id)}
                        className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer inline-flex items-center justify-center border border-transparent"
                      >
                        <FaEllipsisV size={12} />
                      </button>
                      {activeDropdownId === res.id && (
                        <div className="absolute right-6 mt-1 w-36 bg-[#222222] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden text-left py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                          <button onClick={() => { setActiveDropdownId(null); toast.success(`Viewing details for ${res.name}`); }} className="w-full text-left px-4 py-2 hover:bg-white/5 text-gray-300 hover:text-white transition-colors cursor-pointer text-xs font-semibold">
                            View Details
                          </button>
                          <button onClick={() => { setActiveDropdownId(null); toast.success(`Editing settings for ${res.name}`); }} className="w-full text-left px-4 py-2 hover:bg-white/5 text-gray-300 hover:text-white transition-colors cursor-pointer text-xs font-semibold">
                            Edit Settings
                          </button>
                          <button
                            onClick={() => {
                              setActiveDropdownId(null);
                              if (res.status === "Pending Approval") {
                                approveRestaurant(res.id, res.name);
                              } else {
                                toggleStatus(res.id, res.name, res.status);
                              }
                            }}
                            className={`w-full text-left px-4 py-2 hover:bg-white/5 transition-colors cursor-pointer text-xs font-bold ${res.status === "Active" ? "text-red-400 hover:text-red-300" : "text-emerald-400 hover:text-emerald-300"}`}
                          >
                            {res.status === "Active" ? "Suspend" : res.status === "Pending Approval" ? "Approve" : "Activate"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <BottomNav />
      </section>
    );
  }

  // Standard outlet analytics view (Admin, Waiter, Cashier)
  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-4rem)] overflow-hidden flex flex-col md:flex-row gap-3 pb-16 md:pb-0 select-none">
      {/* Left Div */}
      <div className="flex-[3] flex flex-col min-w-0 overflow-y-auto scrollbar-hide h-full pb-6">
        {isRestaurantAdmin ? (
          <Greetings
            showDropdown={true}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            onRefresh={handleRefresh}
          />
        ) : (
          <Greetings />
        )}

        {isLoading ? (
          isRestaurantAdmin ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-8 mt-5 animate-pulse">
              <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 min-h-[135px] flex flex-col justify-between">
                <div className="h-3 bg-neutral-800 rounded w-1/3"></div>
                <div className="h-8 bg-neutral-800 rounded w-2/3 mt-4"></div>
                <div className="h-3 bg-neutral-800 rounded w-1/2 mt-2"></div>
              </div>
              <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 min-h-[135px] flex flex-col justify-between">
                <div className="h-3 bg-neutral-800 rounded w-1/3"></div>
                <div className="h-8 bg-neutral-800 rounded w-2/3 mt-4"></div>
                <div className="h-3 bg-neutral-800 rounded w-1/2 mt-2"></div>
              </div>
              <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 min-h-[135px] flex flex-col justify-between">
                <div className="h-3 bg-neutral-800 rounded w-1/3"></div>
                <div className="h-8 bg-neutral-800 rounded w-2/3 mt-4"></div>
                <div className="h-3 bg-neutral-800 rounded w-1/2 mt-2"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-8 mt-5 animate-pulse">
              <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 min-h-[135px] flex flex-col justify-between">
                <div className="h-3 bg-neutral-800 rounded w-1/3"></div>
                <div className="h-8 bg-neutral-800 rounded w-2/3 mt-4"></div>
                <div className="h-3 bg-neutral-800 rounded w-1/2 mt-2"></div>
              </div>
              <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 min-h-[135px] flex flex-col justify-between">
                <div className="h-3 bg-neutral-800 rounded w-1/3"></div>
                <div className="h-8 bg-neutral-800 rounded w-2/3 mt-4"></div>
                <div className="h-3 bg-neutral-800 rounded w-1/2 mt-2"></div>
              </div>
            </div>
          )
        ) : isRestaurantAdmin ? (
          /* Premium 3-column Grid for Restaurant Admin */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-8 mt-5">
            {/* Card 1: Today's Revenue */}
            <div className="bg-[#16251d]/40 p-5 rounded-2xl border border-emerald-500/20 flex flex-col justify-between min-h-[135px] w-full transition-all duration-300 hover:border-emerald-500/35 hover:shadow-xl hover:shadow-black/25">
              <div className="flex items-center justify-between">
                <h1 className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Today's Revenue</h1>
                <div className="p-2 rounded-xl text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  <BsCashCoin size={16} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-black text-white tracking-tight leading-none">
                  ₹{analytics.today.sales.toFixed(2)}
                </p>
                <div className="text-gray-500 text-[11px] mt-2 font-semibold flex items-center justify-between">
                  <span>{analytics.today.count} transaction{analytics.today.count !== 1 ? "s" : ""}</span>
                  <span className="text-emerald-400 font-bold flex items-center">live update</span>
                </div>
              </div>
            </div>

            {/* Card 2: Range-Based Revenue */}
            <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[135px] w-full transition-all duration-300 hover:border-yellow-400/20 hover:shadow-xl hover:shadow-black/25">
              <div className="flex items-center justify-between">
                <h1 className="text-[#ababab] font-bold uppercase tracking-wider text-[10px]">{stats.rangeText}</h1>
                <div className="p-2 rounded-xl text-[#f5f5f5] bg-[#262626] border border-white/5">
                  <BsCashCoin size={16} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-black text-white tracking-tight leading-none">
                  ₹{stats.revenue.toLocaleString("en-IN")}.00
                </p>
                <p className="text-gray-500 text-[11px] mt-3.5 font-semibold">
                  {stats.ordersCount} orders
                </p>
              </div>
            </div>

            {/* Card 3: Avg Transaction */}
            <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[135px] w-full transition-all duration-300 hover:border-yellow-400/20 hover:shadow-xl hover:shadow-black/25">
              <div className="flex items-center justify-between">
                <h1 className="text-[#ababab] font-bold uppercase tracking-wider text-[10px]">Avg Transaction</h1>
                <div className="p-2 rounded-xl text-[#ababab] bg-[#262626] border border-white/5">
                  <GrInProgress size={16} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-black text-white tracking-tight leading-none">
                  ₹{stats.avgTransaction.toFixed(2)}
                </p>
                <p className="text-gray-500 text-[11px] mt-3.5 font-semibold">
                  per sale
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Standard 2-column Grid for Waiters and Cashiers */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-8 mt-5">
            <MiniCard title="Total Earnings" icon={<BsCashCoin />} number={analytics.allTime.sales} footerNum={1.6} trend="up" />
            <MiniCard title="In Progress" icon={<GrInProgress />} number={analytics.today.inProgress} footerNum={3.6} trend="up" />
          </div>
        )}

        {isRestaurantAdmin && (
          isLoading ? (
            <div className="mx-8 mt-6 bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 h-[280px] animate-pulse flex flex-col justify-between">
              <div className="h-4 bg-neutral-800 rounded w-1/4"></div>
              <div className="h-32 bg-neutral-800/10 rounded w-full mt-4"></div>
              <div className="flex justify-between w-full mt-4">
                <div className="h-3 bg-neutral-800 rounded w-12"></div>
                <div className="h-3 bg-neutral-800 rounded w-12"></div>
                <div className="h-3 bg-neutral-800 rounded w-12"></div>
              </div>
            </div>
          ) : (
            <RevenueChart
              hourlySales={analytics?.hourlySales || []}
              dailyStastistics={analytics?.dailySales || []}
            />
          )
        )}

        <RecentOrders />
      </div>

      {/* Right Div */}
      <div className="flex-[2] min-w-0 overflow-hidden border-t md:border-t-0 md:border-l border-[#2d2d2d]/30 flex flex-col pb-16 md:pb-0">
        <PopularDishes />
      </div>
      <BottomNav />
    </section>
  )
}

export default Home;
