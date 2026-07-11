import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { Landing, Home, Auth, Orders, Tables, Menu, NotFound } from "./pages"
import Header from "./components/shared/Header"

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user)
  if (!user) {
    return <Navigate to="/auth" replace />
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
  return (
    <>
      <Header />
      <Outlet />
    </>
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
          </Route>

          {/* Wildcard Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}
export default App