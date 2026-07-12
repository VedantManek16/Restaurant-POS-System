import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Store, Key } from "lucide-react";
import { apiRequest } from "../../utils/api";

const DEFAULT_EMPLOYEES = [
  { name: "Super Admin", email: "superadmin@restro.com", password: "RestroDesk!2026", role: "Super Admin", phone: "1111111111" },
  { name: "Taste Hub Admin", email: "admin@restro.com", password: "RestroDesk!2026", role: "Restaurant Admin", phone: "2222222222" },
  { name: "Sarah Cashier", email: "cashier@restro.com", password: "RestroDesk!2026", role: "Cashier", phone: "3333333333" },
  { name: "John Waiter", email: "waiter@restro.com", password: "RestroDesk!2026", role: "Waiter", phone: "4444444444" }
];

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
        password: matched.password
      });
      setShowDemoMenu(false);
      toast(`Filled demo credentials for ${roleName}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("/user/login", {
        method: "POST",
        body: {
          email: formData.email,
          password: formData.password
        }
      });

      if (response.success) {
        const { name, email, phone, role, tenantId, tenantName } = response.data;

        dispatch(setUser({ name, email, phone, role, tenantId, tenantName }));
        toast.success(`Logged in successfully as ${role}.`);
        navigate("/dashboard");
      } else {
        toast.error(response.message || "Invalid credentials.");
      }
    } catch (error) {
      toast.error(error.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* Email Input */}
        <div>
          <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
            Employee Email
          </label>
          <div className="relative flex h-9 items-center bg-[#262626] rounded-xl border border-white/5 focus-within:border-yellow-400/50 focus-within:ring-1 focus-within:ring-yellow-400/50 transition-all overflow-hidden">
            <div className="absolute left-4 text-gray-500">
              <Mail size={16} />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@restro.com"
              className="w-full bg-transparent pl-11 pr-4 h-full text-xs text-white placeholder-gray-500 focus:outline-none rounded-xl"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative flex h-9 items-center bg-[#262626] rounded-xl border border-white/5 focus-within:border-yellow-400/50 focus-within:ring-1 focus-within:ring-yellow-400/50 transition-all overflow-hidden">
            <div className="absolute left-4 text-gray-500">
              <Lock size={16} />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-transparent pl-11 pr-4 h-full text-xs text-white placeholder-gray-500 focus:outline-none rounded-xl"
              required
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl py-2 bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-bold tracking-wide transition-all duration-200 transform active:scale-[0.98] flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-yellow-400/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="flex flex-wrap gap-2 mt-2 w-full justify-center animate-in fade-in slide-in-from-top-1 duration-150">
            {["Super Admin", "Restaurant Admin", "Cashier", "Waiter"].map((role) => (
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