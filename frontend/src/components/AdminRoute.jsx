import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <p>Checking Session...</p>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default AdminRoute;
