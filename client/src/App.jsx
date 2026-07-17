import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { Landing, Home, Auth, Orders, Tables, Menu, NotFound, AccessDenied, Staff, Settings, Reports, MenuManagement } from "./pages"
import Header from "./components/shared/Header"
import Sidebar from "./components/shared/Sidebar"
import { ROUTE_ACCESS } from "./constants/roles"
import { apiRequest } from "./utils/api"

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  const path = location.pathname
  const allowedRoles = ROUTE_ACCESS[path]

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />
  }

  return children ? children : <Outlet />
}

const AuthRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user)
  if (user) {
    return <Navigate to="/dashboard" replace />
  }
  return children ? children : <Outlet />
}

const DashboardLayout = () => {
  const location = useLocation();
  const isScrollbarHiddenPage = ["/403", "/staff", "/dashboard"].includes(location.pathname);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiRequest("/settings");
        if (res.success && res.data && res.data.restaurantName) {
          document.title = res.data.restaurantName;
        }
      } catch (error) {
        console.error("Error fetching settings for page title:", error);
      }
    };
    fetchSettings();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      localStorage.setItem("sidebarCollapsed", !prev);
      return !prev;
    });
  };

  return (
    <div className="flex h-screen w-full bg-[#121212] overflow-hidden text-white">
      {/* Sidebar Navigation */}
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
        
        {/* Page Content */}
        <div className={`flex-1 overflow-y-auto relative pb-16 md:pb-0 ${isScrollbarHiddenPage ? "scrollbar-hide" : ""}`}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu-management" element={<MenuManagement />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/403" element={<AccessDenied />} />
          </Route>

          {/* Wildcard Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}
export default App