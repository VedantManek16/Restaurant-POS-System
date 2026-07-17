import { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaBell, FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { apiRequest, BASE_URL } from "../../utils/api";
import { formatTime12Hr } from "../../utils/dateFormatter";
import { BiSolidDish } from "react-icons/bi";
import CreateOrderModal from "./CreateOrderModal";
import { toast } from "react-hot-toast";

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

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("pos_notifications");
    return saved ? JSON.parse(saved) : [];
  });
  const [unreadCount, setUnreadCount] = useState(() => {
    return parseInt(localStorage.getItem("pos_unread_count") || "0", 10);
  });
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);

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
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user || !user.tenantId) return;

    // Connect to SSE notifications stream
    const streamUrl = `${BASE_URL}/order/notifications/stream?restaurantId=${user.tenantId}`;
    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Play standard POS notification sound
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav");
        audio.play().catch(() => {});

        // Trigger custom toaster notification
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-[#1e1e1e] border border-yellow-400/30 shadow-2xl rounded-xl pointer-events-auto flex p-4`}>
            <div className="flex-1 w-0">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <span className="text-lg">🔔</span>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-xs font-bold text-white">{data.title}</p>
                  <p className="mt-0.5 text-[10px] text-gray-400 font-medium leading-normal">{data.message}</p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-white/5 pl-2 ml-2">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg flex items-center justify-center text-[10px] font-bold text-yellow-400 hover:text-yellow-300 focus:outline-none cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        ), { duration: 6000 });

        // Prepend new notifications
        setNotifications((prev) => {
          const updated = [data, ...prev].slice(0, 20);
          localStorage.setItem("pos_notifications", JSON.stringify(updated));
          return updated;
        });

        setUnreadCount((prev) => {
          const updated = prev + 1;
          localStorage.setItem("pos_unread_count", updated.toString());
          return updated;
        });

      } catch (err) {
        console.error("Error parsing message event:", err);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [user]);

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

        {/* Notification Bell */}
        <div className="relative" ref={bellRef}>
          <div 
            onClick={() => {
              setBellOpen(!bellOpen);
              setUnreadCount(0);
              localStorage.setItem("pos_unread_count", "0");
            }}
            className="bg-[#1f1f1f] rounded-xl p-2 cursor-pointer hover:bg-[#262626] transition-colors border border-[#2d2d2d]/30 relative"
          >
            <FaBell className="text-[#f5f5f5] text-lg" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-[8px] font-black text-white w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>

          {/* Notifications Dropdown */}
          {bellOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1e1e1e] border border-white/5 rounded-xl shadow-2xl z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-white/5 flex justify-between items-center">
                <span className="text-xs font-bold text-white">Notifications</span>
                {notifications.length > 0 && (
                  <button 
                    onClick={() => {
                      setNotifications([]);
                      localStorage.setItem("pos_notifications", "[]");
                    }}
                    className="text-[9px] font-bold text-red-400 hover:text-red-300 uppercase cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
                {notifications.length > 0 ? (
                  notifications.map((n, idx) => (
                    <div key={idx} className="p-3.5 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-start gap-2.5">
                        <span className="text-xs">🔔</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-white">{n.title}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">{n.message}</p>
                          <span className="text-[8px] text-gray-500 mt-1 block">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-[11px] text-gray-500 font-medium">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
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