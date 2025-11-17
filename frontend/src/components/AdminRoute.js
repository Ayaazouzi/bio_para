import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  // Vérifie si l'utilisateur est admin
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "admin"

  if (!token || role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminRoute;
