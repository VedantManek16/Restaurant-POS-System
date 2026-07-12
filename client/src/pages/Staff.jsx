import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaUserPlus, FaSearch, FaUserShield, FaTrash, FaUserTag } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";

const MOCK_STAFF = [
  { id: 1, name: "Vedant Manek", email: "superadmin@restro.com", role: "Super Admin", phone: "1111111111", outlet: "All Outlets" },
  { id: 2, name: "Taste Hub Admin", email: "admin@restro.com", role: "Restaurant Admin", phone: "2222222222", outlet: "Restro Main (Downtown)" },
  { id: 3, name: "Sarah Cashier", email: "cashier@restro.com", role: "Cashier", phone: "3333333333", outlet: "Restro Main (Downtown)" },
  { id: 4, name: "John Waiter", email: "waiter@restro.com", role: "Waiter", phone: "4444444444", outlet: "Restro Main (Downtown)" },
  { id: 5, name: "Michael Waiter", email: "michael@restro.com", role: "Waiter", phone: "9876543220", outlet: "Restro Main (Downtown)" },
  { id: 6, name: "Emily Cashier", email: "emily@restro.com", role: "Cashier", phone: "9876543221", outlet: "Restro West End (Bistro)" }
];

const Staff = () => {
  const { user } = useSelector((state) => state.user);
  const isSuperAdmin = user?.role === "Super Admin";

  const [staffList, setStaffList] = useState(MOCK_STAFF);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Waiter",
    outlet: isSuperAdmin ? "Restro Main (Downtown)" : (user?.tenant || "Restro Main (Downtown)")
  });

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email || !newStaff.phone) {
      toast.error("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newStaff.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const created = {
      id: Date.now(),
      ...newStaff
    };

    setStaffList([created, ...staffList]);
    setShowAddModal(false);
    setNewStaff({
      name: "",
      email: "",
      phone: "",
      role: "Waiter",
      outlet: isSuperAdmin ? "Restro Main (Downtown)" : (user?.tenant || "Restro Main (Downtown)")
    });
    toast.success(`${created.name} added as ${created.role}!`);
  };

  const handleDeleteStaff = (id, name) => {
    setStaffList(staffList.filter(s => s.id !== id));
    toast.success(`Removed ${name} from staff registry.`);
  };

  const filteredStaff = staffList.filter(s => {
    // If NOT super admin, only show staff from the same outlet / tenant
    const sameOutlet = isSuperAdmin || s.outlet === "All Outlets" || s.outlet === user?.tenant;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.role.toLowerCase().includes(searchTerm.toLowerCase());
    return sameOutlet && matchesSearch;
  });

  return (
    <div className="p-6 bg-[#1f1f1f] min-h-[calc(100vh-4rem)] text-[#f5f5f5] space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FaUserShield className="text-yellow-400" /> 
            {isSuperAdmin ? "Platform User Directory" : "Staff Management"}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {isSuperAdmin 
              ? "View and manage all registered platform administrators, operators, and staff." 
              : `Manage access rights, account roles, and active employees for ${user?.tenant || "your outlet"}.`}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-yellow-400 hover:bg-yellow-300 text-gray-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-yellow-400/10 cursor-pointer"
        >
          <FaUserPlus size={14} />
          {isSuperAdmin ? "Add Platform User" : "Add Staff Member"}
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative flex items-center max-w-md bg-[#262626] rounded-xl border border-white/5 focus-within:border-yellow-400/50 transition-all">
        <div className="absolute left-4 text-gray-500">
          <FaSearch size={14} />
        </div>
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent pl-11 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
        />
      </div>

      {/* Grid of Cards or Table */}
      <Card className="bg-[#181818] border-white/5 overflow-hidden">
        <CardHeader className="border-b border-white/5 py-4 px-6">
          <CardTitle className="text-sm font-semibold text-gray-300">
            Registered Users ({filteredStaff.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-black/10">
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Email / Phone</th>
                  <th className="py-3 px-6">Role</th>
                  <th className="py-3 px-6">Outlet Assignment</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-white/[0.02] transition-colors text-xs text-gray-300">
                    <td className="py-4 px-6 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#262626] border border-white/10 flex items-center justify-center font-bold text-[10px] text-yellow-400">
                          {staff.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        {staff.name}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span>{staff.email}</span>
                        <span className="text-[10px] text-gray-500 font-mono mt-0.5">{staff.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        staff.role === "Super Admin" 
                          ? "bg-purple-500/10 border-purple-500/30 text-purple-400" 
                          : staff.role === "Restaurant Admin"
                          ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                          : staff.role === "Cashier"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      }`}>
                        <FaUserTag size={8} />
                        {staff.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-400">
                      {staff.outlet}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {staff.email !== user?.email ? (
                        <button
                          onClick={() => handleDeleteStaff(staff.id, staff.name)}
                          className="text-red-400/80 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer"
                        >
                          <FaTrash size={12} />
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-500 font-semibold italic">Current Session</span>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredStaff.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-500 text-xs font-medium">
                      No staff records found matching the filter query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
              <FaUserPlus className="text-yellow-400" />
              {isSuperAdmin ? "Register Platform User" : "Add Staff Member"}
            </h3>
            
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Waiter"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full bg-[#262626] border border-white/5 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@restro.com"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="w-full bg-[#262626] border border-white/5 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  className="w-full bg-[#262626] border border-white/5 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                  Access Role
                </label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  className="w-full bg-[#262626] border border-white/5 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none cursor-pointer focus:border-yellow-400/50"
                >
                  {isSuperAdmin && <option value="Super Admin">Super Admin</option>}
                  <option value="Restaurant Admin">Restaurant Admin</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Waiter">Waiter</option>
                </select>
              </div>

              {isSuperAdmin && (
                <div>
                  <label className="block text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                    Outlet / Tenant ID
                  </label>
                  <select
                    value={newStaff.outlet}
                    onChange={(e) => setNewStaff({ ...newStaff, outlet: e.target.value })}
                    className="w-full bg-[#262626] border border-white/5 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none cursor-pointer focus:border-yellow-400/50"
                  >
                    <option value="All Outlets">All Outlets (Super Admin)</option>
                    <option value="Restro Main (Downtown)">Restro Main (Downtown)</option>
                    <option value="Restro West End (Bistro)">Restro West End (Bistro)</option>
                    <option value="Restro Airport (Express)">Restro Airport (Express)</option>
                  </select>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold text-xs py-2 rounded-xl cursor-pointer"
                >
                  Create User
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs py-2 rounded-xl cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
