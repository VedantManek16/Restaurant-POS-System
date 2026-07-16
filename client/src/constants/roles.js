export const ROLES = {
  SUPER_ADMIN: "Super Admin",
  RESTAURANT_ADMIN: "Restaurant Admin",
  CASHIER: "Cashier",
  WAITER: "Waiter",
  KITCHEN_STAFF: "Kitchen Staff"
};

// Route access mapping
export const ROUTE_ACCESS = {
  "/dashboard": [ROLES.SUPER_ADMIN, ROLES.RESTAURANT_ADMIN, ROLES.CASHIER, ROLES.WAITER, ROLES.KITCHEN_STAFF],
  "/orders": [ROLES.RESTAURANT_ADMIN, ROLES.CASHIER, ROLES.WAITER, ROLES.KITCHEN_STAFF],
  "/tables": [ROLES.RESTAURANT_ADMIN, ROLES.WAITER, ROLES.CASHIER],
  "/menu": [ROLES.RESTAURANT_ADMIN, ROLES.CASHIER, ROLES.WAITER],
  "/staff": [ROLES.SUPER_ADMIN, ROLES.RESTAURANT_ADMIN],
  "/settings": [ROLES.RESTAURANT_ADMIN],
  "/reports": [ROLES.RESTAURANT_ADMIN],
  "/menu-management": [ROLES.RESTAURANT_ADMIN]
};

// Sidebar / Navigation items layout per role
export const NAVIGATION_ITEMS = {
  [ROLES.SUPER_ADMIN]: [
    { label: "Platform Dashboard", path: "/dashboard", icon: "FaHome" },
    { label: "User Management", path: "/staff", icon: "FaUsers" }
  ],
  [ROLES.RESTAURANT_ADMIN]: [
    { label: "Dashboard", path: "/dashboard", icon: "FaHome" },
    { label: "POS / Billing", path: "/menu", icon: "BiSolidDish" },
    { label: "Manage Menu", path: "/menu-management", icon: "FaUtensils" },
    { label: "Orders", path: "/orders", icon: "MdOutlineReorder" },
    { label: "Tables", path: "/tables", icon: "MdTableBar" },
    { label: "Staff", path: "/staff", icon: "FaUsers" },
    { label: "Reports", path: "/reports", icon: "FaChartBar" },
    { label: "Settings", path: "/settings", icon: "FaCog" }
  ],
  [ROLES.CASHIER]: [
    { label: "Dashboard", path: "/dashboard", icon: "FaHome" },
    { label: "Tables", path: "/tables", icon: "MdTableBar" },
    { label: "POS / Billing", path: "/menu", icon: "BiSolidDish" },
    { label: "Orders", path: "/orders", icon: "MdOutlineReorder" }
  ],
  [ROLES.WAITER]: [
    { label: "Dashboard", path: "/dashboard", icon: "FaHome" },
    { label: "Tables", path: "/tables", icon: "MdTableBar" },
    { label: "POS / Order Menu", path: "/menu", icon: "BiSolidDish" },
    { label: "Orders", path: "/orders", icon: "MdOutlineReorder" }
  ],
  [ROLES.KITCHEN_STAFF]: [
    { label: "Kitchen Display (KDS)", path: "/orders", icon: "MdOutlineReorder" }
  ]
};
