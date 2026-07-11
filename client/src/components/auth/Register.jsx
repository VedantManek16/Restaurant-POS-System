import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { User, Mail, Phone, Lock, UserPlus, Utensils, Coins, Shield, Store } from "lucide-react";
import { PhoneInput } from "@/components/ui/phone-input";

const Register = ({ setIsRegister }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    tenant: "downtown",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelection = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.role) {
      toast.error("Please choose your employee role.");
      return;
    }

    if (!formData.phone) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Fetch currently registered users
      const registeredUsers = JSON.parse(localStorage.getItem("mock_users") || "[]");

      // Check if user already exists
      const emailExists = registeredUsers.some(
        (u) => u.email.toLowerCase() === formData.email.toLowerCase()
      );
      
      const isDefaultEmail = ["admin@restro.com", "waiter@restro.com", "cashier@restro.com"].includes(
        formData.email.toLowerCase()
      );

      if (emailExists || isDefaultEmail) {
        toast.error("An employee account with this email already exists.");
        setIsLoading(false);
        return;
      }

      // Add new user
      const newUser = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        tenant: formData.tenant,
      };

      registeredUsers.push(newUser);
      localStorage.setItem("mock_users", JSON.stringify(registeredUsers));

      toast.success("Employee account registered successfully!");
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "",
        tenant: "downtown",
      });

      setTimeout(() => {
        setIsRegister(false);
      }, 1500);

      setIsLoading(false);
    }, 1000); // Simulate API latency
  };

  const roles = [
    { name: "Waiter", icon: Utensils, desc: "Manage orders & tables" },
    { name: "Cashier", icon: Coins, desc: "Process payments & billing" },
    { name: "Admin", icon: Shield, desc: "Full control & analytics" },
  ];

  return (
    <div>
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

        {/* Name and Email side-by-side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
              Employee Name
            </label>
            <div className="relative flex items-center bg-[#262626] rounded-xl border border-white/5 focus-within:border-yellow-400/50 focus-within:ring-1 focus-within:ring-yellow-400/50 transition-all">
              <div className="absolute left-3.5 text-gray-500">
                <User size={14} />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full bg-transparent pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
              Employee Email
            </label>
            <div className="relative flex items-center bg-[#262626] rounded-xl border border-white/5 focus-within:border-yellow-400/50 focus-within:ring-1 focus-within:ring-yellow-400/50 transition-all">
              <div className="absolute left-3.5 text-gray-500">
                <Mail size={14} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@restro.com"
                className="w-full bg-transparent pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Phone and Password side-by-side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <PhoneInput
              defaultCountry="IN"
              value={formData.phone}
              onChange={(val) => setFormData({ ...formData, phone: val })}
              placeholder="Phone number"
              className="bg-[#262626] border-white/5 h-[34px] focus-within:border-yellow-400/50 focus-within:ring-1 focus-within:ring-yellow-400/50 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative flex items-center bg-[#262626] rounded-xl border border-white/5 focus-within:border-yellow-400/50 focus-within:ring-1 focus-within:ring-yellow-400/50 transition-all">
              <div className="absolute left-3.5 text-gray-500">
                <Lock size={14} />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 chars"
                className="w-full bg-transparent pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Choose Role */}
        <div>
          <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
            Choose Employee Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((role) => {
              const RoleIcon = role.icon;
              const isSelected = formData.role === role.name;
              return (
                <button
                  key={role.name}
                  type="button"
                  onClick={() => handleRoleSelection(role.name)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 cursor-pointer text-center group ${
                    isSelected
                      ? "bg-yellow-400/10 border-yellow-400 text-yellow-400 shadow-sm shadow-yellow-400/5"
                      : "bg-[#262626] border-white/5 text-gray-400 hover:bg-[#2c2c2c] hover:text-gray-200"
                  }`}
                >
                  <RoleIcon 
                    size={16} 
                    className={`mb-1 transition-transform duration-200 group-hover:scale-110 ${
                      isSelected ? "text-yellow-400" : "text-gray-500 group-hover:text-gray-400"
                    }`}
                  />
                  <span className="text-[10px] font-bold">{role.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl py-2.5 bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-bold tracking-wide transition-all duration-200 transform active:scale-[0.98] flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-yellow-400/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              Sign Up
              <UserPlus size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Register;