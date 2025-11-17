// src/App.js
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import MyNavbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminHeader from "./components/AdminHeader";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";

import Dashboard from "./pages/Dashboard";      
import ProductsAdmin from "./pages/ProductsAdmin";

import AdminRoute from "./components/AdminRoute";

function AppContent() {
  const location = useLocation();

  const hideClientLayout =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  const showAdminHeader = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideClientLayout && !showAdminHeader && <MyNavbar />}
      {showAdminHeader && <AdminHeader />}

      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public */}
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><ProductsAdmin /></AdminRoute>} />

        {/* Redirection ancienne route /dashboard */}
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Page 404 */}
        <Route path="*" element={<p className="text-center mt-5">Page non trouvée</p>} />
      </Routes>

      {!hideClientLayout && !showAdminHeader && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
