import { FaSearch, FaUserCircle, FaBell } from "react-icons/fa";
import logo from "../../assets/logo.png";

const Header = () => {
  return (
    <header className="flex justify-between items-center px-8 py-3 bg-[#1a1a1a] border-b border-[#2d2d2d]/30 h-16">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="h-7 w-7 object-contain" />
        <h1 className="text-md font-semibold text-[#f5f5f5] tracking-wide">Restro</h1>
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
        <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity">
          <FaUserCircle className="text-[#f5f5f5] text-3xl" />
          <div className="flex flex-col items-start leading-tight">
            <h1 className="text-xs text-[#f5f5f5] font-semibold">Vedant Manek</h1>
            <p className="text-[10px] text-[#ababab] font-medium">Admin</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header