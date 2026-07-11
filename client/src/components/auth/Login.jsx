import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Store, Key } from "lucide-react";

const DEFAULT_EMPLOYEES = [
  { name: "Vedant Manek", email: "admin@restro.com", password: "admin123", role: "Admin", phone: "9876543210" },
  { name: "John Waiter", email: "waiter@restro.com", password: "waiter123", role: "Waiter", phone: "9876543211" },
  { name: "Sarah Cashier", email: "cashier@restro.com", password: "cashier123", role: "Cashier", phone: "9876543212" }
];

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    tenant: "downtown",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDemoSelect = (roleName) => {
    const matched = DEFAULT_EMPLOYEES.find(e => e.role === roleName);
    if (matched) {
      setFormData({
        email: matched.email,
        password: matched.password,
        tenant: "downtown"
      });
      setShowDemoMenu(false);
      toast(`Filled demo credentials for ${roleName}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // Load all registered users from local storage
      const registeredUsers = JSON.parse(localStorage.getItem("mock_users") || "[]");
      
      // Combine with default employees
      const allUsers = [...DEFAULT_EMPLOYEES, ...registeredUsers];
      
      // Find matching user
      const userFound = allUsers.find(
        (u) => u.email.toLowerCase() === formData.email.toLowerCase() && u.password === formData.password
      );

      if (userFound) {
        const { name, email, phone, role } = userFound;
        const tenantMap = {
          downtown: "Restro Main (Downtown)",
          bistro: "Restro West End (Bistro)",
          express: "Restro Airport (Express)"
        };
        const activeTenant = tenantMap[formData.tenant] || tenantMap["downtown"];
        
        dispatch(setUser({ name, email, phone, role, tenant: activeTenant }));
        toast.success(`Logged into ${activeTenant} successfully.`);
        navigate("/dashboard");
      } else {
        toast.error("Invalid email or password. Please try again.");
      }
      setIsLoading(false);
    }, 800); // Add a small delay to simulate response
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Tenant/Branch Selection */}
        <div>
          <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
            Outlet / Tenant ID
          </label>
          <div className="relative flex items-center bg-[#262626] rounded-xl border border-white/5 focus-within:border-yellow-400/50 focus-within:ring-1 focus-within:ring-yellow-400/50 transition-all">
            <div className="absolute left-4 text-gray-500 pointer-events-none">
              <Store size={16} />
            </div>
            <select
              name="tenant"
              value={formData.tenant}
              onChange={handleChange}
              className="w-full bg-transparent pl-11 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none cursor-pointer"
            >
              <option value="downtown" className="bg-[#1e1e1e] text-white">Restro Main (Downtown)</option>
              <option value="bistro" className="bg-[#1e1e1e] text-white">Restro West End (Bistro)</option>
              <option value="express" className="bg-[#1e1e1e] text-white">Restro Airport (Express)</option>
            </select>
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
            Employee Email
          </label>
          <div className="relative flex items-center bg-[#262626] rounded-xl border border-white/5 focus-within:border-yellow-400/50 focus-within:ring-1 focus-within:ring-yellow-400/50 transition-all">
            <div className="absolute left-4 text-gray-500">
              <Mail size={16} />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@restro.com"
              className="w-full bg-transparent pl-11 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative flex items-center bg-[#262626] rounded-xl border border-white/5 focus-within:border-yellow-400/50 focus-within:ring-1 focus-within:ring-yellow-400/50 transition-all">
            <div className="absolute left-4 text-gray-500">
              <Lock size={16} />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-transparent pl-11 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl py-2.5 bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-bold tracking-wide transition-all duration-200 transform active:scale-[0.98] flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-yellow-400/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              Sign In
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials Quick Switcher */}
      <div className="flex flex-col items-center mt-3 pt-3 border-t border-white/5">
        <button
          type="button"
          onClick={() => setShowDemoMenu(!showDemoMenu)}
          className="text-[11px] text-yellow-400/80 hover:text-yellow-400 font-medium transition-colors flex items-center gap-1.5 cursor-pointer focus:outline-none"
        >
          <Key size={12} />
          Use Demo Account
        </button>
        
        {showDemoMenu && (
          <div className="flex gap-2 mt-2 w-full justify-center animate-in fade-in slide-in-from-top-1 duration-150">
            {["Admin", "Waiter", "Cashier"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleDemoSelect(role)}
                className="bg-[#262626] border border-white/5 hover:border-yellow-400/30 text-[10px] text-gray-300 px-3 py-1.5 rounded-lg hover:text-white transition-all cursor-pointer font-semibold"
              >
                {role}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;