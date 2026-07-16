import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaUserCircle, FaBell, FaSignOutAlt } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils/api";
import { formatTime12Hr } from "../../utils/dateFormatter";
import { BiSolidDish } from "react-icons/bi";
import CreateOrderModal from "./CreateOrderModal";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-xs font-semibold text-[#ababab] bg-[#1f1f1f] border border-[#2d2d2d]/30 px-3.5 py-2 rounded-xl select-none">
      {formatTime12Hr(time)}
    </div>
  );
};

const Header = ({ toggleSidebar, isSidebarCollapsed }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await apiRequest("/user/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout API error:", error);
    }
    dispatch(logoutUser());
    navigate("/auth");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center px-8 py-3 bg-[#1a1a1a] border-b border-[#2d2d2d]/30 h-16 relative">
      {/* Brand / Logo */}
      <div className="flex items-center gap-3">
        {user?.role === "Super Admin" ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white tracking-tight">Platform Dashboard</span>
            <span className="text-[9px] bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-bold uppercase ml-1">Admin</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-white tracking-tight">{user?.tenantName || "Taste Hub"}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1"></span>
            <span className="text-[9px] text-[#ababab] font-bold uppercase tracking-wider">Restaurant Operator</span>
          </div>
        )}
      </div>
      
      {/* Search */}
      <div className="flex items-center gap-3 bg-[#1f1f1f] rounded-full px-4 py-1.5 w-[360px] border border-[#2d2d2d]/30">
        <FaSearch className="text-[#ababab] text-xs" />
        <input
          type="text"
          placeholder="Search"
          className="bg-[#1f1f1f] outline-none text-[#f5f5f5] text-xs w-full placeholder-[#ababab]"
        />
      </div>

      {/* Logged user details */}
      <div className="flex items-center gap-4">
        {user?.role !== "Super Admin" && (
          <>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#f6b100] hover:bg-[#e0a100] text-[#1a1a1a] px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md select-none border border-[#f6b100]/25"
            >
              <BiSolidDish size={15} />
              <span>New Order</span>
            </button>
            <CreateOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </>
        )}

        {/* Time display */}
        <Clock />

        <div className="bg-[#1f1f1f] rounded-xl p-2 cursor-pointer hover:bg-[#262626] transition-colors border border-[#2d2d2d]/30">
          <FaBell className="text-[#f5f5f5] text-lg" />
        </div>
        
        {/* User Profile Menu */}
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity p-1.5 rounded-xl hover:bg-[#242424] transition-colors"
          >
            <FaUserCircle className="text-[#f5f5f5] text-3xl" />
            <div className="flex flex-col items-start leading-tight">
              <h1 className="text-xs text-[#f5f5f5] font-semibold">
                {user?.name || "Vedant Manek"}
              </h1>
              <p className="text-[10px] text-[#ababab] font-medium">
                {user?.role || "Admin"}
              </p>
            </div>
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1e1e1e] border border-white/5 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-white/5">
                <p className="text-xs text-gray-400">Signed in as</p>
                <p className="text-xs text-white font-semibold truncate">{user?.email || "admin@restro.com"}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-[#262626] transition-colors flex items-center gap-2 font-semibold cursor-pointer"
              >
                <FaSignOutAlt className="text-sm" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header