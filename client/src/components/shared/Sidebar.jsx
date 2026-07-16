import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/userSlice";
import { apiRequest } from "../../utils/api";
import { 
  FaHome, 
  FaUsers, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaUtensils
} from "react-icons/fa";
import { MdOutlineReorder, MdTableBar } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import logo from "../../assets/logo.png";
import { NAVIGATION_ITEMS } from "../../constants/roles";

// Icon lookup helper
const iconMap = {
  FaHome: FaHome,
  FaUsers: FaUsers,
  BiSolidDish: BiSolidDish,
  MdOutlineReorder: MdOutlineReorder,
  MdTableBar: MdTableBar,
  FaChartBar: FaChartBar,
  FaCog: FaCog,
  FaUtensils: FaUtensils
};

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await apiRequest("/user/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout API error:", error);
    }
    dispatch(logoutUser());
    navigate("/auth");
  };

  if (!user) return null;

  const items = NAVIGATION_ITEMS[user.role] || [];

  return (
    <aside className={`hidden md:flex flex-col bg-[#1a1a1a] border-r border-[#2d2d2d]/30 h-screen sticky top-0 left-0 z-40 select-none transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
      {/* Brand Logo & Name */}
      <div className={`flex items-center h-16 border-b border-[#2d2d2d]/30 overflow-hidden transition-all duration-300 ${isCollapsed ? "justify-center px-4" : "justify-between px-6"}`}>
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="h-8 w-8 object-contain shrink-0" />
              <div className="flex flex-col transition-all duration-300">
                <span className="text-sm font-bold text-white tracking-wide">RestroDesk</span>
                <span className="text-[9px] text-[#f6b100] font-bold uppercase tracking-wider">SaaS POS Platform</span>
              </div>
            </div>
            <button 
              onClick={toggleSidebar} 
              className="text-gray-500 hover:text-white p-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-white/5 bg-[#1f1f1f] flex items-center justify-center"
              title="Collapse Sidebar"
            >
              <FaChevronLeft size={10} />
            </button>
          </>
        ) : (
          <button 
            onClick={toggleSidebar} 
            className="text-gray-500 hover:text-white p-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-white/5 bg-[#1f1f1f] flex items-center justify-center"
            title="Expand Sidebar"
          >
            <FaChevronRight size={12} />
          </button>
        )}
      </div>

      {/* Outlet Details */}
      {!isCollapsed && (
        <div className="mx-4 mt-4 p-3 bg-[#222222] border border-white/5 rounded-xl flex flex-col gap-1 overflow-hidden transition-all duration-300 animate-in fade-in">
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
            {user.role === "Super Admin" ? "Platform" : "Restaurant"}
          </span>
          <span className="text-xs text-white font-semibold truncate">
            {user.tenantName || "RestroDesk"}
          </span>
        </div>
      )}

      {/* Dynamic Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-hide">
        {items.map((item) => {
          const IconComp = iconMap[item.icon] || FaHome;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center w-full rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                isCollapsed ? "justify-center p-3" : "gap-3.5 px-4 py-3"
              } ${
                isActive
                  ? "bg-yellow-400/10 border-yellow-400 text-yellow-400"
                  : "bg-transparent border-transparent text-[#ababab] hover:text-[#f5f5f5] hover:bg-white/[0.02]"
              }`}
            >
              <IconComp size={16} className="shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User Information & Logout */}
      <div className="p-4 border-t border-[#2d2d2d]/30 space-y-3 overflow-hidden">
        <div className={`flex items-center rounded-xl bg-white/[0.02] border border-white/5 ${isCollapsed ? "justify-center p-1.5" : "gap-3 px-2 py-1.5"}`}>
          <div className="w-8 h-8 rounded-full bg-[#f6b100]/10 border border-[#f6b100]/25 flex items-center justify-center font-bold text-xs text-[#f6b100] shrink-0">
            {user.name.split(" ").map(n => n[0]).join("")}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 transition-all duration-300">
              <span className="text-xs font-bold text-white truncate">{user.name}</span>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">{user.role}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          title={isCollapsed ? "Sign Out" : undefined}
          className={`flex items-center w-full rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer border border-transparent ${
            isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-2.5"
          }`}
        >
          <FaSignOutAlt size={14} className="shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
