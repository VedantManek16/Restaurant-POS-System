import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom"
import { Landing, Home, Auth, Orders, Tables, Menu, NotFound } from "./pages"
import Header from "./components/shared/Header"

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
          <Route path="/auth" element={<Auth />} />

          {/* Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>
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