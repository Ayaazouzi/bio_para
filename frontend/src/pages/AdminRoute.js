// src/components/AdminRoute.jsx
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    alert("Accès réservé aux administrateurs.");
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default AdminRoute;
