import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaUserCircle, FaBell, FaSignOutAlt } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
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
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-7 w-7 object-contain" />
          <h1 className="text-md font-semibold text-[#f5f5f5] tracking-wide">RestroDesk</h1>
        </div>
        <div className="hidden sm:block h-4 w-[1px] bg-[#2d2d2d]"></div>
        <div className="hidden sm:flex items-center gap-1.5 bg-[#262626] border border-white/5 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-[10px] text-gray-300 font-semibold tracking-wide">
            {user?.tenant || "Restro Main (Downtown)"}
          </span>
        </div>
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